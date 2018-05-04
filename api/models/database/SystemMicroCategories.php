<?php

namespace app\models\database;

use Yii;

/**
 * This is the model class for table "system_micro_categories".
 *
 * @property integer $id
 * @property string $key
 * @property string $label
 * @property string $created_at
 * @property string $updated_at
 *
 * @property ActivitiesMicroCategories[] $activitiesMicroCategories
 * @property Activities[] $activities
 */
class SystemMicroCategories extends \yii\db\ActiveRecord
{
    public $activities_id;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'system_micro_categories';
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
    public function getActivitiesMicroCategories()
    {
        return $this->hasMany(ActivitiesMicroCategories::className(), ['system_micro_categories_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActivities()
    {
        return $this->hasMany(Activities::className(), ['id' => 'activities_id', 'created_by' => 'activities_created_by'])->viaTable('activities_micro_categories', ['system_micro_categories_id' => 'id']);
    }
}
