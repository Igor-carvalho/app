<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "itineraries_activities".
 *
 * @property integer $itineraries_id
 * @property integer $user_id
 * @property integer $activities_id
 * @property string $start_time
 * @property string $end_time
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Activities $activities
 * @property Itineraries $itineraries
 */
class ItinerariesActivities extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'itineraries_activities';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['itineraries_id', 'user_id', 'activities_id'], 'required'],
            [['itineraries_id', 'user_id', 'activities_id'], 'integer'],
            [['start_time', 'end_time', 'created_at', 'updated_at'], 'safe'],
            [['activities_id'], 'exist', 'skipOnError' => true, 'targetClass' => Activities::className(), 'targetAttribute' => ['activities_id' => 'id']],
            [['itineraries_id', 'user_id'], 'exist', 'skipOnError' => true, 'targetClass' => Itineraries::className(), 'targetAttribute' => ['itineraries_id' => 'id', 'user_id' => 'user_id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'itineraries_id' => 'Itineraries ID',
            'user_id' => 'User ID',
            'activities_id' => 'Activities ID',
            'start_time' => 'Start Time',
            'end_time' => 'End Time',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActivities()
    {
        return $this->hasOne(Activities::className(), ['id' => 'activities_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getItineraries()
    {
        return $this->hasOne(Itineraries::className(), ['id' => 'itineraries_id', 'user_id' => 'user_id']);
    }
}
