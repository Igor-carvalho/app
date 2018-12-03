<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "weather_types".
 *
 * @property integer $id
 * @property string $key
 * @property string $label
 * @property string $created_at
 * @property string $updated_at
 *
 * @property ActivitiesWeathers[] $activitiesWeathers
 * @property Activities[] $activities
 */
class WeatherTypes extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'weather_types';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['created_at', 'updated_at'], 'safe'],
            [['key', 'label'], 'string', 'max' => 45],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'key' => 'Key',
            'label' => 'Label',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActivitiesWeathers()
    {
        return $this->hasMany(ActivitiesWeathers::className(), ['weather_types_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActivities()
    {
        return $this->hasMany(Activities::className(), ['id' => 'activities_id', 'created_by' => 'activities_created_by'])->viaTable('activities_weathers', ['weather_types_id' => 'id']);
    }
}
