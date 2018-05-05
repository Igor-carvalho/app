<?php

namespace app\modules\v1\controllers;

use app\componenets\ItineraryCooker;
use app\filters\auth\HttpBearerAuth;
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
        $behaviors['authenticator']['except'] = ['options', 'cooking'];


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
        return new ActiveDataProvider([
            'query' => Activities::find()->where([
                'soft_deleted' => 0
            ])
        ]);
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

            $activityObj->date_starts = $this->toFrontDateObject($activityObj->date_starts);
            $activityObj->date_ends = $this->toFrontDateObject($activityObj->date_ends);

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

    public function actionCooking($activities, $date_start, $date_end)
    {
        $activities = explode(",", $activities);
//        $connection = \Yii::$app->db;
//        $transaction = $connection->beginTransaction();
//
//        $itinerary = new Itineraries();
//        $itinerary->user_id = 1; // TODO: change with logged in user
//        $itinerary->date_starts = $date_start;
//        $itinerary->date_ends = $date_end;
//
//        try {
//            if ($itinerary->save()) {
//
//                foreach ($activities as $activity) {
//                    $itineraryActivity = new ItinerariesActivities();
//                    $itineraryActivity->itineraries_id = $itinerary->id;
//                    $itineraryActivity->itineraries_user_id = $itinerary->user_id;
//                    $itineraryActivity->activities_id = $activity;
//                    $itineraryActivity->itineraries_user_id = $itinerary->user_id;
//                    $itineraryActivity->save();
//                }
//
//
//            } else {
//
//            }
//        } catch (Exception $e) {
//            $transaction->rollback();
////                echo "Exception";
//            throw new HttpException(500, json_encode("unable to complete database transactions"));
//        }


        $dbActivities = Activities::find()
            ->select([
                'id', 'longitude', 'latitude', 'date_starts', 'time_start_hh', 'time_start_mm',
                'date_ends', 'time_end_hh', 'time_end_mm',
            ])
            ->where(['id' => $activities])
            ->all();

//        $dbActivities[0]->toArray();

        if ($dbActivities == null) {
            throw new HttpException(404, json_encode("Couldn't find any activities selected"));
        }


        $iteraryCooker = new ItineraryCooker($dbActivities);
        $iteraryCooker->sort_activities();
//        $iteraryCooker->


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