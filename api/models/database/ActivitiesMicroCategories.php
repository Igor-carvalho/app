<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "activities_micro_categories".
 *
 * @property integer $activities_id
 * @property integer $system_micro_categories_id
 *
 * @property Activities $activities
 * @property SystemMicroCategories $systemMicroCategories
 */
class ActivitiesMicroCategories extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'activities_micro_categories';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['activities_id', 'system_micro_categories_id'], 'required'],
            [['activities_id', 'system_micro_categories_id'], 'integer'],
            [['activities_id'], 'exist', 'skipOnError' => true, 'targetClass' => Activities::className(), 'targetAttribute' => ['activities_id' => 'id']],
            [['system_micro_categories_id'], 'exist', 'skipOnError' => true, 'targetClass' => SystemMicroCategories::className(), 'targetAttribute' => ['system_micro_categories_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'activities_id' => 'Activities ID',
            'system_micro_categories_id' => 'System Micro Categories ID',
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
    public function getSystemMicroCategories()
    {
        return $this->hasOne(SystemMicroCategories::className(), ['id' => 'system_micro_categories_id']);
    }
}
