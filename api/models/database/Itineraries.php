<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "itineraries".
 *
 * @property integer $id
 * @property string $date_starts
 * @property string $date_ends
 * @property string $created_at
 * @property string $updated_at
 * @property integer $user_id
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
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
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
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
            'user_id' => 'User ID',
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
}
