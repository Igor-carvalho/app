<?php

namespace app\models\database\language;

use Yii;

/**
 * This is the model class for table "languages".
 *
 * @property integer $id
 * @property string $name
 * @property string $short_code
 *
 * @property LanguagesContent[] $languagesContents
 */
class Languages extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'languages';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'string', 'max' => 45],
            [['short_code'], 'string', 'max' => 3],
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
            'short_code' => 'Short Code',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLanguagesContents()
    {
        return $this->hasMany(LanguagesContent::className(), ['languages_id' => 'id']);
    }
}
