<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "activities_weathers".
 *
 * @property integer $activities_id
 * @property integer $weather_types_id
 *
 * @property Activities $activities
 * @property WeatherTypes $weatherTypes
 */
class ActivitiesWeathers extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'activities_weathers';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['activities_id', 'weather_types_id'], 'required'],
            [['activities_id', 'weather_types_id'], 'integer'],
            [['activities_id'], 'exist', 'skipOnError' => true, 'targetClass' => Activities::className(), 'targetAttribute' => ['activities_id' => 'id']],
            [['weather_types_id'], 'exist', 'skipOnError' => true, 'targetClass' => WeatherTypes::className(), 'targetAttribute' => ['weather_types_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'activities_id' => 'Activities ID',
            'weather_types_id' => 'Weather Types ID',
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
    public function getWeatherTypes()
    {
        return $this->hasOne(WeatherTypes::className(), ['id' => 'weather_types_id']);
    }
}
