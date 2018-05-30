<?php

namespace app\models\database;

use app\models\User;
use Yii;

/**
 * This is the model class for table "itineraries".
 *
 * @property integer $id
 * @property string $date_starts
 * @property string $date_ends
 * @property integer $adults
 * @property integer $childrens
 * @property integer $budget_type
 * @property string $macro_categories
 * @property string $itinerary_cook_raw
 * @property integer $user_id
 * @property string $created_at
 * @property string $updated_at
 *
 * @property User $user
 * @property ItinerariesActivities[] $itinerariesActivities
 * @property Activities[] $activities
 */
class Itineraries extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'itineraries';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['date_starts', 'date_ends', 'created_at', 'updated_at'], 'safe'],
            [['adults', 'childrens', 'budget_type', 'user_id'], 'integer'],
            [['macro_categories', 'itinerary_cook_raw'], 'string'],
            [['user_id'], 'required'],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'date_starts' => 'Date Starts',
            'date_ends' => 'Date Ends',
            'adults' => 'Adults',
            'childrens' => 'Childrens',
            'budget_type' => 'Budget Type',
            'macro_categories' => 'Macro Categories',
            'itinerary_cook_raw' => 'Itinerary Cook Raw',
            'user_id' => 'User ID',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getItinerariesActivities()
    {
        return $this->hasMany(ItinerariesActivities::className(), ['itineraries_id' => 'id', 'itineraries_user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActivities()
    {
        return $this->hasMany(Activities::className(), ['id' => 'activities_id'])->viaTable('itineraries_activities', ['itineraries_id' => 'id', 'itineraries_user_id' => 'user_id']);
    }

    public function export($itinerary, $user_email)
    {
        $itineraryLink = \Yii::$app->params['frontendURL'] . "/itinerary?id={$itinerary->id}";
        $itineraryCook = $itinerary->itinerary_cook_raw;

        Yii::$app->mailer->htmlLayout = "itinerary/itinerary_layout";
        $email = \Yii::$app->mailer
            ->compose(
                ['html' => 'itinerary/itinerary_content'],
                [
                    'appName' => \Yii::$app->name,
                    'itineraryLink' => $itineraryLink,
                    'itineraryCook' => $itineraryCook
                ]
            )
            ->setTo($user_email)
            ->setFrom([\Yii::$app->params['supportEmail'] => \Yii::$app->name])
            ->setSubject('Your Itinerary Is Ready!')
            ->send();

        return $email;
    }
}
