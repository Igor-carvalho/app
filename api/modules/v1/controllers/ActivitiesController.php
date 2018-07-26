<?php

namespace app\modules\v1\controllers;

use app\componenets\DateTimeHelper;
use app\componenets\HelperFunction;
use app\componenets\ItineraryCooker;
use app\filters\auth\HttpBearerAuth;
use app\models\custom\itinerary\Itinerary;
use app\models\database\Activities;
use app\models\database\ActivitiesMacroCategories;
use app\models\database\ActivitiesMicroCategories;
use app\models\database\ActivitiesWeathers;
use app\models\database\Itineraries;
use app\models\database\ItinerariesActivities;
use app\models\database\language\LanguagesContent;
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

class ActivitiesController extends ActiveController
{
    public $modelClass = 'app\models\database\Activities';

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
        $behaviors['authenticator']['except'] = ['options', 'filter-single-day'];


        // setup access
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['index', 'view', 'create', 'update', 'delete'], //only be applied to
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
        $dataProvider = new ActiveDataProvider([
            'query' => Activities::find()->where([
                'soft_deleted' => 0
            ]),
            'pagination' => false
        ]);

        return $dataProvider;
    }

    public function actionView($id)
    {
        $activity = Activities::find()
            ->where([
                'id' => $id
            ])
            ->one();


        if ($activity) {
            $activityObj = json_decode(json_encode($activity->toArray()));
            $activityObj->macro_category = $activity->getWeatherTypeIds();
            $activityObj->micro_category = $activity->getMicroCategoryIds();
            $activityObj->weather_types = $activity->getMacroCategoryIds();

            $activityObj->date_starts = $this->toFrontDateObject(DateTimeHelper::getDateOnly($activityObj->date_starts));
            $activityObj->date_ends = $this->toFrontDateObject(DateTimeHelper::getDateOnly($activityObj->date_ends));
            $activityObj->translations = LanguagesContent::findAll([
                'record_id' => $activity->id,
                'languages_tables_id' => Activities::$LANGUAGE_TABLE_ID
            ]);

            return $activityObj;
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
        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();

        $model = Activities::find()
            ->where([
                'id' => $id
            ])
            ->one();


        $postData = \Yii::$app->getRequest()->getBodyParams();
        $model->load($postData, '');
        $model->images = json_encode($model->images);

        $translations = $postData['translations'];


        $model->date_starts = $this->fromFrontDateObject($model->date_starts);
        $model->date_ends = $this->fromFrontDateObject($model->date_ends);


        try {
            if ($model->validate() && $model->save()) {

                ActivitiesMicroCategories::deleteAll(['activities_id' => $model->id]);
                foreach ($model->micro_category as $micro) {
                    $storeMicroCat = new ActivitiesMicroCategories();
                    $storeMicroCat->activities_id = $model->id;
                    $storeMicroCat->system_micro_categories_id = $micro;
                    $storeMicroCat->save();
                }

                ActivitiesMacroCategories::deleteAll(['activities_id' => $model->id]);
                foreach ($model->macro_category as $each) {
                    $storeCategory = new ActivitiesMacroCategories();
                    $storeCategory->activities_id = $model->id;
                    $storeCategory->system_macro_categories_id = $each;
                    $storeCategory->save();
                }

                ActivitiesWeathers::deleteAll(['activities_id' => $model->id]);
                foreach ($model->weather_types as $each) {
                    $storeChild = new ActivitiesWeathers();
                    $storeChild->activities_id = $model->id;
                    $storeChild->weather_types_id = $each;
                    $storeChild->save();
                }

                LanguagesContent::deleteAll([
                    'record_id' => $model->id,
                    'languages_tables_id' => $translations[0]['languages_tables_id']
                ]);

                foreach ($translations as $translation) {

                    if (empty($translation['translation'])) {
                        continue;
                    }

                    $storeLanguageContent = new LanguagesContent();
                    $storeLanguageContent->record_id = $model->id;
                    $storeLanguageContent->languages_id = $translation['languages_id'];
                    $storeLanguageContent->languages_tables_columns_id = $translation['languages_tables_columns_id'];
                    $storeLanguageContent->languages_tables_id = $translation['languages_tables_id'];
                    $storeLanguageContent->translation = $translation['translation'];
                    if (!$storeLanguageContent->save()) {
                        HelperFunction::output($storeLanguageContent->errors);
                    }
                }


            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        } catch (\Exception $exception) {
            $transaction->rollBack();
            throw new HttpException(500, json_encode("unable to complete database trasactions"));
        }


        $transaction->commit();
        $response = \Yii::$app->getResponse();
        $response->setStatusCode(200);


        return $model;
    }

    public function actionDelete($id)
    {
        $model = Activities::findOne(['id' => $id]);

        if ($model == null) {
            throw new NotFoundHttpException("Object not found: $id");
        }

        Activities::updateAll(['soft_deleted' => true], ['id' => $id]);

        $response = \Yii::$app->getResponse();
        $response->setStatusCode(204);
        return "ok";
    }

    public function actionOptions($id = null)
    {
        return "ok";
    }

    public function actionFilter($people, $budget, $macros = [], $date_start, $date_end)
    {
//        $macros = implode(",", $macros);
        $activities_macro_table = ActivitiesMacroCategories::tableName();
        $activities_micro_table = ActivitiesMicroCategories::tableName();

        $system_micro_table = SystemMicroCategories::tableName();

        $activities = Activities::find()
            ->where([
                'budget' => $budget,
            ])
//            ->andWhere(['>=', 'date_starts', $date_start])
//            ->andWhere(['<=', 'date_ends', $date_end])
            ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
            ->andWhere(['>=', 'max_people', $people])
            ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
            ->all();

        if (sizeof($activities) == 0)
            return [];

        $activityIds = array_map(function ($activity) {
            return $activity->id;
        }, $activities);
        $activitiesIdComma = implode(",", $activityIds);


        $activitesMicroCategories = SystemMicroCategories::find()
            ->select("{$activities_micro_table}.activities_id, {$system_micro_table}.icon")
            ->where("id IN (SELECT system_micro_categories_id FROM {$activities_micro_table} WHERE activities_id IN ($activitiesIdComma) )")
            ->leftJoin($activities_micro_table, "{$activities_micro_table}.system_micro_categories_id = {$system_micro_table}.id")
            ->groupBy("{$activities_micro_table}.activities_id")
            ->asArray()
            ->all();
        $activityMicroIcon = ArrayHelper::map($activitesMicroCategories, 'activities_id', 'icon');


//        HelperFunction::output($activityMicroIcon);
        $return = [];

        foreach ($activities as $activity) {

            if (isset($activityMicroIcon[$activity->id])) {
                $object = json_decode(json_encode($activity->toArray()));
                $object->micro_icon = $activityMicroIcon[$activity->id];

                $return[] = $object;
            }
        }


        return $return;
    }

    public function actionFilterSingleDay($people, $budget, $macros = [], $date_start, $date_end, $time_from, $time_to)
    {

        $itinerary = new Itineraries();
        $itinerary->itinerary_cook_raw = new Itinerary();
//        $macros = implode(",", $macros);
        $activities_macro_table = ActivitiesMacroCategories::tableName();
        $activities_micro_table = ActivitiesMicroCategories::tableName();

        $system_micro_table = SystemMicroCategories::tableName();

        $activities = Activities::find()
            ->where([
                'budget' => $budget,
            ])
//            ->andWhere(['>=', 'date_starts', $date_start])
//            ->andWhere(['<=', 'date_ends', $date_end])
            ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
            ->andWhere("('$time_from' BETWEEN time_start_hh AND time_end_hh) OR ('$time_to' BETWEEN time_start_hh AND time_end_hh)")
            ->andWhere(['>=', 'max_people', $people])
            ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
            ->all();

        if (sizeof($activities) == 0)
            return $itinerary;

//        HelperFunction::output($activities);

        $activityIds = array_map(function ($activity) {
            return $activity->id;
        }, $activities);
        $activitiesIdComma = implode(",", $activityIds);


        $activitesMicroCategories = SystemMicroCategories::find()
            ->select("{$activities_micro_table}.activities_id, {$system_micro_table}.icon")
            ->where("id IN (SELECT system_micro_categories_id FROM {$activities_micro_table} WHERE activities_id IN ($activitiesIdComma) )")
            ->leftJoin($activities_micro_table, "{$activities_micro_table}.system_micro_categories_id = {$system_micro_table}.id")
            ->groupBy("{$activities_micro_table}.activities_id")
            ->asArray()
            ->all();
        $activityMicroIcon = ArrayHelper::map($activitesMicroCategories, 'activities_id', 'icon');


        $iteraryCooker = new ItineraryCooker($activities, $date_start, $date_end, true, $time_from, $time_to);
        $activitiesIternery = $iteraryCooker->sort_activities();


//        return $activitiesIternery;

        foreach ($activitiesIternery->days as $dayKey => $day) {

            foreach ($day->hours as $hourKey => $hour) {
                $hour->activity['micro_icon'] = $activityMicroIcon[$hour->activity['id']];
            }

        }


        $itinerary->itinerary_cook_raw = $activitiesIternery;

        return $itinerary;
    }

    public function actionReplaceFilter($id, $activity_id, $current_activities)
    {
        $user_id = Yii::$app->user->id;
//        $user_id = 10;

//        $current_activities = explode(",", $current_activities);
        $itinerary = Itineraries::findOne(['id' => $id, 'user_id' => $user_id]);
        if ($itinerary == null)
            throw new NotFoundHttpException("Object not found: $id");

        $replaceItineraryActivity = ItinerariesActivities::findOne(['itineraries_id' => $id, 'activities_id' => $activity_id]);
        if ($replaceItineraryActivity == null)
            throw new NotFoundHttpException("Object not found: $id");


        $budget = $itinerary->budget_type;
        $date_start = $itinerary->date_starts;
        $date_end = $itinerary->date_ends;
        $people = $itinerary->adults;
        $macros = $itinerary->macro_categories;


        $activities_macro_table = ActivitiesMacroCategories::tableName();
        $activities_micro_table = ActivitiesMicroCategories::tableName();
        $itinerary_activities_table = ItinerariesActivities::tableName();

        $system_micro_table = SystemMicroCategories::tableName();

        $activities = Activities::find()
            ->where([
                'budget' => $budget,
            ])
//            ->andWhere(['>=', 'date_starts', $date_start])
            ->andWhere("id NOT IN ($current_activities)")
            ->andWhere("('$date_start' BETWEEN date_starts AND date_ends) OR ('$date_end' BETWEEN date_starts AND date_ends)")
            ->andWhere(['>=', 'max_people', $people])
            ->andWhere("id IN (SELECT activities_id FROM {$activities_macro_table} WHERE system_macro_categories_id IN ($macros) )")
            ->all();


        if (sizeof($activities) == 0)
            return [];

        $filteredActivities = [];
        $filterActivityIds = [];


        $sourceActivityFromDateTime = new \DateTime($replaceItineraryActivity->start_time);
        $sourceActivityToDateTime = new \DateTime($replaceItineraryActivity->end_time);

//        HelperFunction::output($sourceActivityFromDateTime, false);
//        echo "<br>";
//        HelperFunction::output($sourceActivityToDateTime, false);
//        echo "<br>";

        foreach ($activities as $activity) {

//            echo "Activity ID: {$activity->id} <br>";

            $currentActivityRange = DateTimeHelper::getDatesFromRange($activity->date_starts, $activity->date_ends);

            foreach ($currentActivityRange as $currentActivityDate) {

                $currentActivityDate = new \DateTime($currentActivityDate);

                $currentActivityFromDateTime = new \DateTime("{$currentActivityDate->format("Y-m-d")} {$activity->time_start_hh}:{$activity->time_start_mm}");
                $currentActivityToDateTime = new \DateTime("{$currentActivityDate->format("Y-m-d")} {$activity->time_end_hh}:{$activity->time_end_mm}");


//                $startRangeComparison = ($currentActivityFromDateTime >= $sourceActivityFromDateTime && $currentActivityFromDateTime <= $sourceActivityToDateTime);
//                $endRangeComparison = ($currentActivityToDateTime >= $sourceActivityFromDateTime && $currentActivityToDateTime <= $sourceActivityToDateTime);

                $startRangeComparison = DateTimeHelper::dateIsBetween($currentActivityFromDateTime, $currentActivityToDateTime, $sourceActivityFromDateTime);
                $endRangeComparison = DateTimeHelper::dateIsBetween($currentActivityFromDateTime, $currentActivityToDateTime, $sourceActivityToDateTime);

//                echo "{$currentActivityFromDateTime->format('Y-m-d H:i:s')} : {$currentActivityToDateTime->format('Y-m-d H:i:s')},";
//                echo var_dump(DateTimeHelper::dateIsBetween($currentActivityFromDateTime, $currentActivityToDateTime, $sourceActivityFromDateTime)) .
//                    " : " . var_dump(DateTimeHelper::dateIsBetween($currentActivityFromDateTime, $currentActivityToDateTime, $sourceActivityToDateTime));
//                echo "<br>";

                if ($startRangeComparison && $endRangeComparison) {
//                    echo $activity->id . '<br>';
                    if (!in_array($activity->id, $filterActivityIds)) {
                        $filteredActivities[] = $activity;
                        $filterActivityIds[] = $activity->id;
                    }
                }
            }

//            echo "<br>";

        }


//        /* TODO: remove this code. */
//        $activityIds = array_map(function ($activity) {
//            return $activity->id;
//        }, $activities);
//        $activitiesIdComma = implode(",", $activityIds);

//        HelperFunction::output($activitiesIdComma, false);


        $activities = $filteredActivities;

//        HelperFunction::output($filterActivityIds);

        if (sizeof($activities) == 0)
            return [];

        $activityIds = array_map(function ($activity) {
            return $activity->id;
        }, $activities);
        $activitiesIdComma = implode(",", $activityIds);

        $activitesMicroCategories = SystemMicroCategories::find()
            ->select("{$activities_micro_table}.activities_id, {$system_micro_table}.icon")
            ->where("id IN (SELECT system_micro_categories_id FROM {$activities_micro_table} WHERE activities_id IN ($activitiesIdComma) )")
            ->leftJoin($activities_micro_table, "{$activities_micro_table}.system_micro_categories_id = {$system_micro_table}.id")
            ->groupBy("{$activities_micro_table}.activities_id")
            ->asArray()
            ->all();
        $activityMicroIcon = ArrayHelper::map($activitesMicroCategories, 'activities_id', 'icon');


//        HelperFunction::output($activityMicroIcon);
        $return = [];

        foreach ($activities as $activity) {
            $object = json_decode(json_encode($activity->toArray()));
            $object->micro_icon = $activityMicroIcon[$activity->id];

            $return[] = $object;
        }


        return $return;
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


}