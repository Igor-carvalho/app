<?php

namespace app\models\database\language;

use Yii;

/**
 * This is the model class for table "languages_tables".
 *
 * @property integer $id
 * @property string $name
 *
 * @property LanguagesTablesColumns[] $languagesTablesColumns
 */
class LanguagesTables extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'languages_tables';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'string', 'max' => 45],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLanguagesTablesColumns()
    {
        return $this->hasMany(LanguagesTablesColumns::className(), ['languages_tables_id' => 'id']);
    }
}
