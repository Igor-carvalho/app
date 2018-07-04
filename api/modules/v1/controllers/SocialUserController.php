<?php

namespace app\modules\v1\controllers;

use app\componenets\HelperFunction;
use app\componenets\social\FacebookComponent;
use app\componenets\social\GoogleComponent;
use app\componenets\social\SocialProviders;
use app\filters\auth\HttpBearerAuth;
use app\models\database\UserProfile;
use app\models\UserEditForm;
use Yii;

use yii\data\ActiveDataProvider;
use yii\filters\AccessControl;
use yii\filters\auth\CompositeAuth;
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

class SocialUserController extends ActiveController
{
    public $modelClass = 'app\models\User';

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
                'login' => ['get'],
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
        $behaviors['authenticator']['except'] = ['options', 'login', 'signup'];


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
            'query' => User::find()->where([
                '!=', 'status', -1
            ])->andWhere([
                'role' => User::ROLE_USER
            ])
        ]);
    }

    public function actionView($id)
    {
        $staff = User::find()->where([
            'id' => $id
        ])->andWhere([
            '!=', 'status', -1
        ])->andWhere([
            'role' => User::ROLE_USER
        ])->one();


        if ($staff) {
            return $staff;
        } else {
            throw new NotFoundHttpException("Object not found: $id");
        }
    }

    public function actionCreate()
    {
        $model = new User();
        $model->load(\Yii::$app->getRequest()->getBodyParams(), '');

        if ($model->validate() && $model->save()) {
            $response = \Yii::$app->getResponse();
            $response->setStatusCode(201);
            $id = implode(',', array_values($model->getPrimaryKey(true)));
            $response->getHeaders()->set('Location', Url::toRoute([$id], true));
        } else {
            // Validation error
            throw new HttpException(422, json_encode($model->errors));
        }

        return $model;
    }

    public function actionUpdate($id)
    {
        $model = $this->actionView($id);

        $model->load(\Yii::$app->getRequest()->getBodyParams(), '');

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
        $model = $this->actionView($id);

        $model->status = User::STATUS_DELETED;

        if ($model->save(false) === false) {
            throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
        }

        $response = \Yii::$app->getResponse();
        $response->setStatusCode(204);
        return "ok";
    }

    public function actionLogin($authToken, $provider)
    {
        $socialUser = null;
        $userProfileDb = null;
        switch ($provider) {
            case 'FACEBOOK':
                $facebook = new FacebookComponent();
                $socialUser = $facebook->me($authToken);
                if ($socialUser == null) {
                    throw new HttpException(422, json_encode("invalid authentication token."));
                }

                $userProfileDb = UserProfile::findOne(['facebook_profile_id' => $socialUser->id]);

                if ($userProfileDb == null) {
                    throw new HttpException(422, json_encode("invalid authentication token."));
                } else {
                    $userProfileDb->facebook_auth = $authToken;
                    $userProfileDb->save();
                }

                break;
            case "GOOGLE":
                $google = new GoogleComponent();
                $socialUser = $google->me($authToken);

                if ($socialUser == null) {
                    throw new HttpException(422, json_encode("invalid authentication token."));
                }
                $userProfileDb = UserProfile::findOne(['google_profile_id' => $socialUser->id]);

                if ($userProfileDb == null) {
                    throw new HttpException(422, json_encode("invalid authentication token."));
                } else {
                    $userProfileDb->google_auth = $authToken;
                    $userProfileDb->save();
                }
                break;

        }

        $user = User::findOne(['id' => $userProfileDb->user_id]);
        $user->generateAccessTokenAfterUpdatingClientInfo(true);


        $response = \Yii::$app->getResponse();
        $response->setStatusCode(200);
        $id = implode(',', array_values($user->getPrimaryKey(true)));

//        HelperFunction::output($user);
        $responseData = [
            'id' => (int)$id,
            'access_token' => $user->access_token,
        ];

        return $responseData;
    }

    public function actionSignup($authToken, $provider)
    {
        $connection = \Yii::$app->db;
        $transaction = $connection->beginTransaction();

        $model = new SignupForm();
        $userProfile = new UserProfile();

        try {

            $user = null;

            switch ($provider) {
                case SocialProviders::$FACEBOOK:
                    $facebook = new FacebookComponent();
                    $user = $facebook->me($authToken);

                    if ($user == null) {
                        throw new HttpException(422, json_encode("invalid authentication token."));
                    }

                    $model->email = $user->getEmail();
                    $model->username = $user->getEmail();
                    $model->password = HelperFunction::random_password();

                    $userProfile->first_name = $user->getFirstName();
                    $userProfile->last_name = $user->getLastName();
                    $userProfile->full_name = $user->getName();
                    $userProfile->facebook_auth = $authToken;
                    $userProfile->facebook_profile_id = $user->getId();
                    $userProfile->password = $model->password;


                    break;
                case SocialProviders::$GOOGLE:
                    $google = new GoogleComponent();
                    $user = $google->me($authToken);

//                    HelperFunction::output($user);
                    if ($user == null) {
                        throw new HttpException(422, json_encode("invalid authentication token."));
                    }

                    $model->email = $user->email;
                    $model->username = $user->email;
                    $model->password = HelperFunction::random_password();

                    $userProfile->first_name = $user->givenName;
                    $userProfile->last_name = $user->familyName;
                    $userProfile->full_name = $user->name;
                    $userProfile->google_auth = $authToken;
                    $userProfile->google_profile_id = $user->id;
                    $userProfile->password = $model->password;
                    $userProfile->profile_image = $user->picture;

                    break;

            }

            $userDb = User::findOne(['username' => $model->username]);
//            HelperFunction::output($model);
            // if user already registered with email or another social network
            if ($userDb != null) {

                $userProfile = UserProfile::findOne(['user_id' => $userDb->id]);

                if ($userProfile == null) {
                    $userProfile->user_id = $userDb->id;
                    if (!$userProfile->save()) {
                        throw new HttpException(422, json_encode($userProfile->errors));
                    }
                } else {

                    if ($provider == SocialProviders::$FACEBOOK) {

                        $userProfile->first_name = $user->first_name;
                        $userProfile->last_name = $user->last_name;
                        $userProfile->full_name = $user->name;
                        $userProfile->facebook_auth = $authToken;
                        $userProfile->facebook_profile_id = $user->id;

                    } else if ($provider == SocialProviders::$GOOGLE) {

                        $userProfile->first_name = $user->givenName;
                        $userProfile->last_name = $user->familyName;
                        $userProfile->full_name = $user->name;
                        $userProfile->google_auth = $authToken;
                        $userProfile->google_profile_id = $user->id;
                        $userProfile->profile_image = $user->picture;

                    }

                    if (!$userProfile->save()) {
                        throw new HttpException(422, json_encode($userProfile->errors));
                    }

                }

                $userDb->status = User::STATUS_ACTIVE;
                $userDb->confirmed_at = HelperFunction::current_mysql_datetime();

                if ($userDb->save(false)) {
                    $transaction->commit();
                    $response = \Yii::$app->getResponse();
                    $response->setStatusCode(201);
                    $responseData = "true";
                    return $responseData;

                } else {
                    throw new HttpException(422, json_encode($user->errors));
                }


            } else {

                if ($model->validate() && $model->signup()) {

                    $user = User::findOne(['username' => $model->username]);

                    $userProfile->user_id = $user->id;

                    if ($userProfile->save()) {
                        $user->status = User::STATUS_ACTIVE;
                        $user->confirmed_at = HelperFunction::current_mysql_datetime();
                        if ($user->save(false)) {
                        } else {
                            throw new HttpException(422, json_encode($user->errors));
                        }

                    } else {
                        throw new HttpException(422, json_encode($userProfile->errors));
                    }

                    $transaction->commit();
                    $response = \Yii::$app->getResponse();
                    $response->setStatusCode(201);

                    $responseData = "true";

                    return $responseData;
                } else {
                    // Validation error
                    throw new HttpException(422, json_encode($model->errors));
                }
            }
        } catch (\Exception $exception) {
            $transaction->rollBack();
            throw new HttpException(500, $exception->getMessage());
        }
    }


    public function actionOptions($id = null)
    {
        return "ok";
    }
}