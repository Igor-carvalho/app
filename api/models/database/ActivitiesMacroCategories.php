<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "activities_macro_categories".
 *
 * @property integer $activities_id
 * @property integer $system_macro_categories_id
 *
 * @property Activities $activities
 * @property SystemMacroCategories $systemMacroCategories
 */
class ActivitiesMacroCategories extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'activities_macro_categories';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['activities_id', 'system_macro_categories_id'], 'required'],
            [['activities_id', 'system_macro_categories_id'], 'integer'],
            [['activities_id'], 'exist', 'skipOnError' => true, 'targetClass' => Activities::className(), 'targetAttribute' => ['activities_id' => 'id']],
            [['system_macro_categories_id'], 'exist', 'skipOnError' => true, 'targetClass' => SystemMacroCategories::className(), 'targetAttribute' => ['system_macro_categories_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'activities_id' => 'Activities ID',
            'system_macro_categories_id' => 'System Macro Categories ID',
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
    public function getSystemMacroCategories()
    {
        return $this->hasOne(SystemMacroCategories::className(), ['id' => 'system_macro_categories_id']);
    }
}
