<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "itineraries_activities".
 *
 * @property integer $itineraries_id
 * @property integer $itineraries_user_id
 * @property integer $activities_id
 * @property string $time_start_hh
 * @property string $time_start_mm
 * @property string $time_end_hh
 * @property string $time_end_mm
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
            [['itineraries_id', 'itineraries_user_id', 'activities_id'], 'required'],
            [['itineraries_id', 'itineraries_user_id', 'activities_id'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['time_start_hh', 'time_start_mm', 'time_end_hh', 'time_end_mm'], 'string', 'max' => 4],
            [['activities_id'], 'exist', 'skipOnError' => true, 'targetClass' => Activities::className(), 'targetAttribute' => ['activities_id' => 'id']],
            [['itineraries_id', 'itineraries_user_id'], 'exist', 'skipOnError' => true, 'targetClass' => Itineraries::className(), 'targetAttribute' => ['itineraries_id' => 'id', 'itineraries_user_id' => 'user_id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'itineraries_id' => 'Itineraries ID',
            'itineraries_user_id' => 'Itineraries User ID',
            'activities_id' => 'Activities ID',
            'time_start_hh' => 'Time Start Hh',
            'time_start_mm' => 'Time Start Mm',
            'time_end_hh' => 'Time End Hh',
            'time_end_mm' => 'Time End Mm',
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
        return $this->hasOne(Itineraries::className(), ['id' => 'itineraries_id', 'user_id' => 'itineraries_user_id']);
    }
}
