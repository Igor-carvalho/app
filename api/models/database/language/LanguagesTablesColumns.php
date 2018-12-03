<?php

namespace app\models\database\language;

use Yii;

/**
 * This is the model class for table "languages_tables_columns".
 *
 * @property integer $id
 * @property string $name
 * @property integer $languages_tables_id
 *
 * @property LanguagesContent[] $languagesContents
 * @property LanguagesTables $languagesTables
 */
class LanguagesTablesColumns extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'languages_tables_columns';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['languages_tables_id'], 'required'],
            [['languages_tables_id'], 'integer'],
            [['name'], 'string', 'max' => 45],
            [['languages_tables_id'], 'exist', 'skipOnError' => true, 'targetClass' => LanguagesTables::className(), 'targetAttribute' => ['languages_tables_id' => 'id']],
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
            'languages_tables_id' => 'Languages Tables ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLanguagesContents()
    {
        return $this->hasMany(LanguagesContent::className(), ['languages_tables_columns_id' => 'id', 'languages_tables_id' => 'languages_tables_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLanguagesTables()
    {
        return $this->hasOne(LanguagesTables::className(), ['id' => 'languages_tables_id']);
    }
}
