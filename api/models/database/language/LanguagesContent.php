<?php

namespace app\models\database\language;

use Yii;

/**
 * This is the model class for table "languages_content".
 *
 * @property integer $id
 * @property integer $record_id
 * @property integer $languages_id
 * @property integer $languages_tables_columns_id
 * @property integer $languages_tables_id
 * @property string $translation
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Languages $languages
 * @property LanguagesTablesColumns $languagesTablesColumns
 */
class LanguagesContent extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'languages_content';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['record_id', 'languages_id', 'languages_tables_columns_id', 'languages_tables_id'], 'required'],
            [['record_id', 'languages_id', 'languages_tables_columns_id', 'languages_tables_id'], 'integer'],
            [['translation'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['languages_id'], 'exist', 'skipOnError' => true, 'targetClass' => Languages::className(), 'targetAttribute' => ['languages_id' => 'id']],
            [['languages_tables_columns_id', 'languages_tables_id'], 'exist', 'skipOnError' => true, 'targetClass' => LanguagesTablesColumns::className(), 'targetAttribute' => ['languages_tables_columns_id' => 'id', 'languages_tables_id' => 'languages_tables_id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'record_id' => 'Record ID',
            'languages_id' => 'Languages ID',
            'languages_tables_columns_id' => 'Languages Tables Columns ID',
            'languages_tables_id' => 'Languages Tables ID',
            'translation' => 'Translation',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLanguages()
    {
        return $this->hasOne(Languages::className(), ['id' => 'languages_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLanguagesTablesColumns()
    {
        return $this->hasOne(LanguagesTablesColumns::className(), ['id' => 'languages_tables_columns_id', 'languages_tables_id' => 'languages_tables_id']);
    }
}
