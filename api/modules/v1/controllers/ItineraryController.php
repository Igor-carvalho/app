<?php

namespace app\modules\v1\controllers;

use app\componenets\DistanceHelper;
use app\componenets\HelperFunction;
use app\componenets\ItineraryCooker;
use app\filters\auth\HttpBearerAuth;
use app\models\custom\itinerary\Day;
use app\models\custom\itinerary\Hour;
use app\models\custom\itinerary\Itinerary;
use app\models\database\Activities;
use app\models\database\ActivitiesMacroCategories;
use app\models\database\ActivitiesMicroCategories;
use app\models\database\ActivitiesWeathers;
use app\models\database\Itineraries;
use app\models\database\ItinerariesActivities;
use app\models\database\SystemMicroCategories;
use app\models\database\WeatherTypes;
use app\models\UserEditForm;
use Symfony\Component\Console\Command\HelpCommand;
use Yii;

use yii\data\ActiveDataProvider;
use yii\db\Exception;
use yii\filters\AccessControl;
use yii\filters\auth\CompositeAuth;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\rest\ActiveController;

use yii\web\HttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

use app\models\PasswordResetForm;
use app\models\User;
use app\models\SignupForm;
use app\models\LoginForm;
use app\models\SignupConfirmForm;
use app\models\PasswordResetRequestForm;
use app\models\PasswordResetTokenVerificationForm;


class ItineraryController extends ActiveController
{
    public $modelClass = 'app\models\database\Itineraries';

    public function __construct($id, $module, $config = [])
    {
        parent::__construct($id, $module, $config);

    }

    public function actions()
    {
        return [];
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['authenticator'] = [
            'class' => CompositeAuth::className(),
            'authMethods' => [
                HttpBearerAuth::className(),
            ],

        ];

        $behaviors['verbs'] = [
            'class' => \yii\filters\VerbFilter::className(),
            'actions' => [
                'index' => ['get'],
                'view' => ['get'],
                'create' => ['post'],
                'update' => ['put'],
                'delete' => ['delete'],
                'login' => ['post'],
                'me' => ['get', 'post'],
            ],
        ];

        // remove authentication filter
        $auth = $behaviors['authenticator'];
        unset($behaviors['authenticator']);

        // add CORS filter
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
            ],
        ];

        // re-add authentication filter
        $behaviors['authenticator'] = $auth;
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors['authenticator']['except'] = ['options', 'view'];


        // setup access
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['index', 'create', 'update', 'delete'], //only be applied to
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['index', 'view', 'create', 'update', 'delete'],
                    'roles' => ['admin', 'manageUsers'],
                ],
                [
                    'allow' => true,
                    'actions' => ['me'],
                    'roles' => ['user']
                ]
            ],
        ];

        return $behaviors;
    }

    public function actionIndex()
    {
        return new ActiveDataProvider([
            'query' => Activities::find()->where([
                'soft_deleted' => 0
            ])
        ]);
    }

    public function actionView($id)
    {
        $object = Itineraries::find()
            ->where([
                'id' => $id
            ])
            ->one();


        if ($object) {
            $object->itinerary_cook_raw = json_decode($object->itinerary_cook_raw);
            return $object;

        } else {
            throw new NotFoundHttpException("Object not found: $id");
        }
    }

    public function actionCreate()
    {
        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();

        $model = new Activities();
        $model->load(\Yii::$app->getRequest()->getBodyParams(), '');
        $model->images = json_encode($model->images);
        $model->created_by = Yii::$app->user->id;

        $model->date_starts = $this->fromFrontDateObject($model->date_starts);
        $model->date_ends = $this->fromFrontDateObject($model->date_ends);


        if ($model->validate() && $model->save()) {

            try {

                foreach ($model->micro_category as $micro) {
                    $storeMicroCat = new ActivitiesMicroCategories();
                    $storeMicroCat->activities_id = $model->id;
                    $storeMicroCat->system_micro_categories_id = $micro;
                    $storeMicroCat->save();
                }

                foreach ($model->macro_category as $each) {
                    $storeCategory = new ActivitiesMacroCategories();
                    $storeCategory->activities_id = $model->id;
                    $storeCategory->system_macro_categories_id = $each;
                    $storeCategory->save();
                }

                foreach ($model->weather_types as $each) {
                    $storeChild = new ActivitiesWeathers();
                    $storeChild->activities_id = $model->id;
                    $storeChild->weather_types_id = $each;
                    $storeChild->save();
                }

                $transaction->commit();

            } catch (Exception $e) {
                $transaction->rollback();
//                echo "Exception";
                throw new HttpException(500, json_encode("unable to complete database trasactions"));
            }

            $response = \Yii::$app->getResponse();
            $response->setStatusCode(201);
            $id = implode(',', array_values($model->getPrimaryKey(true)));
            $response->getHeaders()->set('Location', Url::toRoute([$id], true));
        } else {
            // Validation error
//            echo "validation error";
            throw new HttpException(422, json_encode($model->errors));
        }


        return $model;
    }

    public function actionUpdate($id)
    {
        $model = Activities::find()
            ->where([
                'id' => $id
            ])
            ->one();

        $model->load(\Yii::$app->getRequest()->getBodyParams(), '');
        $model->images = json_encode($model->images);


        $model->date_starts = $this->fromFrontDateObject($model->date_starts);
        $model->date_ends = $this->fromFrontDateObject($model->date_ends);

        if ($model->validate() && $model->save()) {
            $response = \Yii::$app->getResponse();
            $response->setStatusCode(200);
        } else {
            // Validation error
            throw new HttpException(422, json_encode($model->errors));
        }

        return $model;
    }

    public function actionDelete($id)
    {
        $model = Activities::findOne(['id' => $id]);

        $model->soft_deleted = true;

        if ($model->save(false) === false) {
            throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
        }

        $response = \Yii::$app->getResponse();
        $response->setStatusCode(204);
        return "ok";
    }

    public function actionOptions($id = null)
    {
        return "ok";
    }

    public function actionListing($activities, $date_starts, $date_ends, $num_adults, $num_childs, $budget_type, $macro_categories, $lat, $lng, $citylat, $citylng) {
//        public function actionListing($activities='14,28,16,17,18', $date_starts='2018-05-20', $date_ends='2018-05-23', $num_adults=1, $num_childs=0, $budget_type=2, $macro_categories='1,2') {
        $wishlist = $this->getActivities($num_adults, $budget_type, $macro_categories, $date_starts, $date_ends, $lat, $lng, $citylat, $citylng, $time_from=null, $time_to=null);
        $activities_str = $activities;
        $return_data = [];
        $return_data['adults'] = $num_adults;
        $return_data['childrens'] = $num_childs;
        $return_data['date_starts'] = $date_starts;
        $return_data['date_ends'] = $date_ends;
        $return_data['macro_categories'] = $macro_categories;
        $return_data['budget_type'] = $budget_type;
        $return_data['lat'] = $lat;
        $return_data['lng'] = $lng;
        $return_data['itinerary_cook_raw'] = [];

        $activities = explode(",", $activities_str);

//        $dbActivities = (new \yii\db\Query())
////            ->select(['*', 'ROUND(6378 * 2  * ASIN(SQRT(POWER(SIN((14.18461 - ABS(latitude)) * PI()/180 / 2),2) + COS(14.18461 * PI()/180 ) * COS(ABS(latitude) * PI()/180) * POWER(SIN((40.82101 - longitude ) * PI()/180 / 2), 2) )),2) AS distance'])
//            ->from('activities')
//            ->where(['activities.id' => $activities])
////            ->orderBy('distance')
//            ->all();
//        $sortedActivities = [];
//        foreach ($dbActivities as $activity) {
//            $based_key = array_search($activity['id'], $activities);
//            $sortedActivities[$based_key] = $activity;
//        }
//        ksort($sortedActivities);
//        $dbActivities = $sortedActivities;
//        $dbActivities= Activities::find()->where(['activities.id' => $activities])->all();

        $activities_micro_table = ActivitiesMicroCategories::tableName();
        $system_micro_table = SystemMicroCategories::tableName();
        $wishlist_str = implode(',', array_column($wishlist, 'id'));

        $activitesMicroCategories = SystemMicroCategories::find()
            ->select("{$activities_micro_table}.activities_id, {$system_micro_table}.icon")
            ->where("id IN (SELECT system_micro_categories_id FROM {$activities_micro_table} WHERE activities_id IN ($wishlist_str) )")
            ->leftJoin($activities_micro_table, "{$activities_micro_table}.system_micro_categories_id = {$system_micro_table}.id")
            ->groupBy("{$activities_micro_table}.activities_id")
            ->asArray()
            ->all();
        $activityMicroIcon = ArrayHelper::map($activitesMicroCategories, 'activities_id', 'icon');

//        foreach ($dbActivities as $key => $Activity) {
//            $dbActivities[$key] = array_merge($Activity->toArray(), array('micro_icon'=>$activityMicroIcon[$Activity->id]));
//        }
        foreach ($wishlist as $key => $Activity) {
            if (isset($activityMicroIcon[$Activity['id']])) {
                $dbActivities[$key]['micro_icon'] = $activityMicroIcon[$Activity['id']];
                if (is_array(json_decode($Activity['images'], true)))
                    $dbActivities[$key]['images'] = json_decode($Activity['images'], true);
                else
                    $dbActivities[$key]['images'] = array($Activity['images']);
            }
        }
        $dbActivities = [];
        $selectedCount = count($activities);

        foreach ($wishlist as $activity) {

            if (isset($activityMicroIcon[$activity['id']])) {
                $activity['micro_icon'] = $activityMicroIcon[$activity['id']];

                if (is_array(json_decode($activity['images'], true)))
                    $activity['images'] = json_decode($activity['images'], true);
                else
                    $activity['images'] = array($activity['images']);

                $based_key = array_search($activity['id'], $activities);
                if($based_key !== false) {
                    $dbActivities[$based_key] = $activity;
                } else {
                    $dbActivities[$selectedCount] = $activity;
                    $selectedCount++;
                }
            }
        }

        if ($dbActivities == null) {
            throw new HttpException(404, json_encode("Couldn't find any activities selected"));
        }

        $iteraryCooker = new ItineraryCooker($dbActivities, $date_starts, $date_ends);
//        exit;
        $activitiesIternery = $iteraryCooker->sort_activities();

        $itineraryResponse = new Itinerary();
        $itineraryResponse->days = [];

        $return_data['itinerary_cook_raw'] = $activitiesIternery; //json_encode;//($activitiesIternery);

        return $return_data;
    }

    public function actionCooking($activities, $date_starts, $date_ends, $num_adults, $num_childs, $budget_type, $macro_categories)
    {
        $activities = explode(",", $activities);
        $user_id = Yii::$app->user->id;
//        $user_id = 1;   // TODO: change with logged in user
        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();

        $itinerary = new Itineraries();
        $itinerary->user_id = $user_id;
        $itinerary->date_starts = $date_starts;
        $itinerary->date_ends = $date_ends;
        $itinerary->adults = $num_adults;
        $itinerary->childrens = $num_childs;
        $itinerary->budget_type = $budget_type;
        $itinerary->macro_categories = $macro_categories;

//        HelperFunction::output($itinerary);


        $dbActivities = Activities::find()
            ->select([
                'id', 'longitude', 'latitude', 'date_starts', 'time_start_hh', 'time_start_mm',
                'date_ends', 'time_end_hh', 'time_end_mm', 'duration', 'name', 'images'
            ])
            ->where(['id' => $activities])
            ->all();


//        $dbActivities[0]->toArray();

        if ($dbActivities == null) {
            throw new HttpException(404, json_encode("Couldn't find any activities selected"));
        }

        $iteraryCooker = new ItineraryCooker($dbActivities, $date_starts, $date_ends);
        $activitiesIternery = $iteraryCooker->sort_activities();


        $itinerary->itinerary_cook_raw = json_encode($activitiesIternery);

        try {
            if ($itinerary->save()) {

                foreach ($activitiesIternery->days as $day) {

                    foreach ($day->hours as $hour) {
                        $itineraryActivity = new ItinerariesActivities();
                        $itineraryActivity->itineraries_id = $itinerary->id;
                        $itineraryActivity->user_id = $itinerary->user_id;
                        $itineraryActivity->activities_id = $hour->activity['id'];
                        $itineraryActivity->start_time = $hour->scheduled_hour_from;
                        $itineraryActivity->end_time = $hour->scheduled_hour_to;
                        if (!$itineraryActivity->save()) {
                            throw new HttpException(500, json_encode($itineraryActivity->errors));
                        }
                    }
                }

                $transaction->commit();
            } else {
                throw new HttpException(500, json_encode($itinerary->errors));
            }
        } catch (Exception $e) {
            HelperFunction::output("Exception");

            $transaction->rollback();
            throw new HttpException(500, json_encode("unable to complete database transactions"));
        }

        //remove extra data
        $itinerary->itinerary_cook_raw = "";
        return $itinerary;

    }

    public function actionCookingSingleDay($date_starts, $date_ends, $num_adults, $num_childs, $budget_type, $macro_categories, $time_from, $time_to)
    {

        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();


        $user_id = Yii::$app->user->id;

        $itinerary = new Itineraries();
        $itinerary->user_id = $user_id;
        $itinerary->date_starts = $date_starts;
        $itinerary->date_ends = $date_ends;
        $itinerary->adults = $num_adults;
        $itinerary->childrens = $num_childs;
        $itinerary->budget_type = $budget_type;
        $itinerary->macro_categories = $macro_categories;
//        $itinerary->time_from = $time_from;
//        $itinerary->time_to = $time_to;
//        $itinerary->is_single_day = true;

        $post = \Yii::$app->getRequest()->getBodyParams();

        $post = json_decode(json_encode($post));

        try {

            if (!$itinerary->save()) {
                throw new HttpException(500, json_encode("Unable to insert itinerary object."));
            }

            foreach ($post->itinerary_activities as $itineraryactivity) {
                $storeItinerayActivity = new ItinerariesActivities();
                $storeItinerayActivity->user_id = $user_id;
                $storeItinerayActivity->activities_id = $itineraryactivity->activities_id;
                $storeItinerayActivity->start_time = $itineraryactivity->start_time;
                $storeItinerayActivity->end_time = $itineraryactivity->end_time;
                $storeItinerayActivity->itineraries_id = $itinerary->id;
                if (!$storeItinerayActivity->save()) {
                    $transaction->rollBack();
                    throw new HttpException(500, json_encode("unable to save Itinerary Activites."));
                }

            }

            $transaction->commit();

        } catch (\Exception $exception) {
            $transaction->rollBack();
            throw  $exception;
        }

        return $itinerary;

    }

    public function actionPublic($id)
    {
        $user_id = Yii::$app->user->id;
        $user_id = 3;
        $itineraryDb = Itineraries::findOne(['id' => $id, 'user_id' => $user_id]);
        $itineraryActivities = ItinerariesActivities::find()
            ->where(['itineraries_id' => $id])
            ->with(['activities'])
            ->orderBy(['start_time' => SORT_ASC])
            ->all();
//        echo '<pre>';

        if ($itineraryDb == null)
            throw new NotFoundHttpException("Object not found: $id");

        $activityIds = array_map(function ($activity) {
            return $activity->activities_id;
        }, $itineraryActivities);
        $activitiesIdComma = implode(",", $activityIds);

        $activities_macro_table = ActivitiesMacroCategories::tableName();
        $activities_micro_table = ActivitiesMicroCategories::tableName();
        $system_micro_table = SystemMicroCategories::tableName();

        $activitesMicroCategories = SystemMicroCategories::find()
            ->select("{$activities_micro_table}.activities_id, {$system_micro_table}.icon")
            ->where("id IN (SELECT system_micro_categories_id FROM {$activities_micro_table} WHERE activities_id IN ($activitiesIdComma) )")
            ->leftJoin($activities_micro_table, "{$activities_micro_table}.system_micro_categories_id = {$system_micro_table}.id")
            ->groupBy("{$activities_micro_table}.activities_id")
            ->asArray()
            ->all();
        $activityMicroIcon = ArrayHelper::map($activitesMicroCategories, 'activities_id', 'icon');

        $dayWiseBreakDown = [];
        $itineraryResponse = new Itinerary();
        $itineraryResponse->days = [];

        foreach ($itineraryActivities as $itinerary) {

            $startDate = new \DateTime($itinerary->start_time);
            $dateFormatted = $startDate->format("Y-m-d");

            if (!isset($dayWiseBreakDown[$dateFormatted])) {
                $dayWiseBreakDown[$dateFormatted] = [];
            }

            $hour = new Hour();

            $hour->scheduled_hour_from = $itinerary->start_time;
            $hour->scheduled_hour_to = $itinerary->end_time;
            $hour->activity = json_decode(json_encode($itinerary->activities->toArray()));
            $hour->activity->micro_icon = $activityMicroIcon[$itinerary->activities->id];

            $dayWiseBreakDown[$dateFormatted][] = $hour;
        }

        foreach ($dayWiseBreakDown as $day => $hours) {
            $dayObj = new Day();
            $dayObj->day = $day;
            $dayObj->hours = $hours;

            $itineraryResponse->days[] = $dayObj;

        }

        $itineraryDb->itinerary_cook_raw = $itineraryResponse;

//        print_r($itineraryDb);
        return $itineraryDb;


    }

    public function actionPublicUpdate($id)
    {
        $user_id = Yii::$app->user->id;
        $itineraryDb = Itineraries::findOne(['id' => $id, 'user_id' => $user_id]);

        if ($itineraryDb == null)
            throw new NotFoundHttpException("Object not found: $id");

        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();

        $post = \Yii::$app->getRequest()->getBodyParams();

        $post = json_decode(json_encode($post));

//        return $post['itinerary_activities'];

        try {
            ItinerariesActivities::deleteAll([
                'itineraries_id' => $id
            ]);
            foreach ($post->itinerary_activities as $itineraryactivity) {
                $storeItinerayActivity = new ItinerariesActivities();
                $storeItinerayActivity->user_id = $user_id;
                $storeItinerayActivity->activities_id = $itineraryactivity->activities_id;
                $storeItinerayActivity->start_time = $itineraryactivity->start_time;
                $storeItinerayActivity->end_time = $itineraryactivity->end_time;
                $storeItinerayActivity->itineraries_id = $id;
                if (!$storeItinerayActivity->save()) {
                    $transaction->rollBack();
                    throw new HttpException(500, json_encode("unable to save Itinerary Activites."));
                }

            }

            $transaction->commit();

        } catch (\Exception $exception) {
            $transaction->rollBack();
            throw  $exception;
        }


        return true;

    }

    private function toFrontDateObject($date)
    {
        return [
            'formatted' => $date
        ];
    }

    private function fromFrontDateObject($date)
    {
        if ($date != null && $date != "") {
            return $date['formatted'];
        } else {
            return null;
        }
    }

    public function actionExport()
    {
        $itinerary = \Yii::$app->getRequest()->getBodyParams();

        $sendData = json_decode(json_encode($itinerary));

        $this->saveItinerary($sendData);

        $email = Yii::$app->user->identity->email;

        $itineraryDb = new Itineraries();
        return $itineraryDb->export($sendData, $email);
    }

    public function saveItinerary($itinerary_data) {
        $user_id = Yii::$app->user->id;

        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();

        $itinerary = new Itineraries();
        $itinerary->user_id = $user_id;
        $itinerary->date_starts = $itinerary_data->date_starts;
        $itinerary->date_ends = $itinerary_data->date_ends;
        $itinerary->adults = $itinerary_data->adults;
        $itinerary->childrens = $itinerary_data->childrens;
        $itinerary->budget_type = $itinerary_data->budget_type;
        $itinerary->macro_categories = $itinerary_data->macro_categories;
        $itinerary->itinerary_cook_raw = json_encode($itinerary_data->itinerary_cook_raw, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);

        try {
            if ($itinerary->save()) {
                foreach ($itinerary_data->itinerary_cook_raw->days as $day) {

                    foreach ($day->hours as $hour) {
                        $itineraryActivity = new ItinerariesActivities();
                        $itineraryActivity->itineraries_id = $itinerary->id;
                        $itineraryActivity->user_id = $itinerary->user_id;
                        $itineraryActivity->activities_id = $hour->activity->id;
                        $itineraryActivity->start_time = $hour->scheduled_hour_from;
                        $itineraryActivity->end_time = $hour->scheduled_hour_to;
                        if (!$itineraryActivity->save()) {
                            throw new HttpException(500, json_encode($itineraryActivity->errors));
                        }
                    }
                }

                $transaction->commit();
            } else {
                throw new HttpException(500, json_encode($itinerary->errors));
            }
        } catch (Exception $e) {
            HelperFunction::output("Exception");

            $transaction->rollback();
            throw new HttpException(500, json_encode("unable to complete database transactions"));
        }

    }

    private function getActivities($people, $budget, $macros, $date_start, $date_end, $lat, $lng, $citylat, $citylng, $time_from=null, $time_to=null)
    {
        $cityRange = 10;
        $userRange = 3;
        $activities_macro_table = ActivitiesMacroCategories::tableName();
        $distance = $cityRange + 1;

        if ($lat != null && $lng != null) {
            $lat = (float)$lat;
            $lng = (float)$lng;
            $citylat = (float)$citylat;
            $citylng = (float)$citylng;
            $distance = round(6378 * 2 * asin(sqrt(pow(sin(($lat - abs($citylat)) * pi() / 180 / 2), 2) + cos($lat * pi() / 180) * cos(abs($citylng) * pi() / 180) * pow(sin(($lng - $citylng) * pi() / 180 / 2), 2))), 2);
        }

//        print_r($distance);return;

        if ($time_from == null ||$time_to == null) {
            if ($lat == null || $lng == null || $distance > $cityRange) {
                $activities = (new \yii\db\Query())
                    ->select(['*', 'ROUND(6378 * 2  * ASIN(SQRT(POWER(SIN(('.$citylat.'- ABS(latitude)) * PI()/180 / 2),2) + COS('.$citylat.'* PI()/180 ) * COS(ABS(latitude) * PI()/180) * POWER(SIN(('.$citylng.' - longitude ) * PI()/180 / 2), 2) )),2) AS distance'])
                    ->from('activities')
                    ->where(['budget' => $budget])
                    ->andWhere(['not', ['longitude' => null]])
                    ->andWhere(['not', ['latitude' => null]])
                    ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
                    ->andWhere(['>=', 'max_people', $people])
                    ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
                    ->having(['<', 'distance', $cityRange])
//                    ->orderBy('distance')
//                    ->orderBy('priority')
                    ->orderBy([
                        'priority' => SORT_ASC,
                        'distance'=>SORT_ASC
                    ])
                    ->andWhere(['<>','time_start_hh','00'])
                    ->all();
            } else {
                $activities = (new \yii\db\Query())
                    ->select(['*', 'ROUND(6378 * 2  * ASIN(SQRT(POWER(SIN(('.$lat.'- ABS(latitude)) * PI()/180 / 2),2) + COS('.$lat.'* PI()/180 ) * COS(ABS(latitude) * PI()/180) * POWER(SIN(('.$lng.' - longitude ) * PI()/180 / 2), 2) )),2) AS distance'])
                    ->from('activities')
                    ->where(['budget' => $budget])
                    ->andWhere(['not', ['longitude' => null]])
                    ->andWhere(['not', ['latitude' => null]])
                    ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
                    ->andWhere(['>=', 'max_people', $people])
                    ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
                    ->orderBy([
                        'priority' => SORT_ASC,
                        'distance'=>SORT_ASC
                    ])
                    ->having(['<', 'distance', $userRange])
                    ->andWhere(['<>','time_start_hh','00'])
                    ->all();
            }
        }
        else {
            if ($lat == null || $lng == null || $distance > $cityRange) {
                $activities = (new \yii\db\Query())
                    ->select(['*', 'ROUND(6378 * 2  * ASIN(SQRT(POWER(SIN(('.$citylat.'- ABS(latitude)) * PI()/180 / 2),2) + COS('.$citylat.'* PI()/180 ) * COS(ABS(latitude) * PI()/180) * POWER(SIN(('.$citylng.' - longitude ) * PI()/180 / 2), 2) )),2) AS distance'])
                    ->from('activities')
                    ->where(['budget' => $budget])
                    ->andWhere(['not', ['longitude' => null]])
                    ->andWhere(['not', ['latitude' => null]])
                    ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
                    ->andWhere("('$time_from' BETWEEN time_start_hh AND time_end_hh) OR ('$time_to' BETWEEN time_start_hh AND time_end_hh)")
                    ->andWhere(['>=', 'max_people', $people])
                    ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
                    ->having(['<', 'distance', $userRange])
                    ->orderBy([
                        'priority' => SORT_ASC,
                        'distance'=>SORT_ASC
                    ])
                    ->andWhere(['<>','time_start_hh','00'])
                    ->all();
            } else {
                $activities = (new \yii\db\Query())
                    ->select(['*', 'ROUND(6378 * 2  * ASIN(SQRT(POWER(SIN(('.$lat.'- ABS(latitude)) * PI()/180 / 2),2) + COS('.$lat.'* PI()/180 ) * COS(ABS(latitude) * PI()/180) * POWER(SIN(('.$lng.' - longitude ) * PI()/180 / 2), 2) )),2) AS distance'])
                    ->from('activities')
                    ->where(['budget' => $budget])
                    ->andWhere(['not', ['longitude' => null]])
                    ->andWhere(['not', ['latitude' => null]])
                    ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
                    ->andWhere("('$time_from' BETWEEN time_start_hh AND time_end_hh) OR ('$time_to' BETWEEN time_start_hh AND time_end_hh)")
                    ->andWhere(['>=', 'max_people', $people])
                    ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
                    ->orderBy([
                        'priority' => SORT_ASC,
                        'distance'=>SORT_ASC
                    ])
                    ->having(['<', 'distance', $userRange])
                    ->andWhere(['<>','time_start_hh','00'])
                    ->all();

            }
        }

        return $activities;
    }

}