<?php

namespace app\models\database;

use app\models\User;
use Yii;

/**
 * This is the model class for table "activities".
 *
 * @property integer $id
 * @property string $name
 * @property string $description
 * @property string $address
 * @property string $city
 * @property string $country
 * @property double $longitude
 * @property double $latitude
 * @property string $images
 * @property string $date_starts
 * @property string $time_start_hh
 * @property string $time_start_mm
 * @property string $date_ends
 * @property string $time_end_hh
 * @property string $time_end_mm
 * @property string $budget
 * @property integer $max_people
 * @property string $created_at
 * @property string $updated_at
 * @property string $duration
 * @property integer $created_by
 *
 * @property User $createdBy
 * @property ActivitiesWeathers[] $activitiesWeathers
 * @property WeatherTypes[] $weatherTypes
 */
class Activities extends \yii\db\ActiveRecord
{
    public static $LANGUAGE_TABLE_ID = 1; //Reference from DB.

    public $macro_category;
    public $micro_category;
    public $weather_types;
    public $translations;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'activities';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['description', 'address', 'images'], 'string'],
            [['longitude', 'latitude'], 'number'],
            [['date_starts', 'date_ends', 'created_at', 'updated_at'], 'safe'],
            [['max_people', 'created_by'], 'integer'],
            [['time_start_hh', 'time_start_mm', 'time_end_hh', 'time_end_mm'], 'string', 'max' => 4],
            [['macro_category', 'micro_category', 'weather_types'], 'each', 'rule' => ['integer']],
            [['created_by', 'duration'], 'required'],
            [['name'], 'string', 'max' => 200],
            [['city', 'country'], 'string', 'max' => 45],
            [['budget'], 'string', 'max' => 10],
            [['created_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['created_by' => 'id']],
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
            'description' => 'Description',
            'address' => 'Address',
            'city' => 'City',
            'country' => 'Country',
            'longitude' => 'Longitude',
            'latitude' => 'Latitude',
            'images' => 'Images',
            'date_starts' => 'Date Starts',
            'date_ends' => 'Date Ends',
            'budget' => 'Budget',
            'max_people' => 'Max People',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
            'created_by' => 'Created By',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCreatedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'created_by']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActivitiesWeathers()
    {
        return $this->hasMany(ActivitiesWeathers::className(), ['activities_id' => 'id']);
    }

    public function getActivitiesMacroCategories()
    {
        return $this->hasMany(ActivitiesMacroCategories::className(), ['activities_id' => 'id']);
    }

    public function getActivitiesMicroCategories()
    {
        return $this->hasMany(ActivitiesMicroCategories::className(), ['activities_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getWeatherTypes()
    {
        return $this->hasMany(WeatherTypes::className(), ['id' => 'weather_types_id'])->viaTable('activities_weathers', ['activities_id' => 'id', 'activities_created_by' => 'created_by']);
    }

    public function afterFind()
    {
        parent::afterFind();
        $this->images = json_decode($this->images);
    }


    public function getWeatherTypeIds()
    {
        $data = ActivitiesWeathers::find()
            ->select(['weather_types_id'])
            ->where(['activities_id' => $this->id])
            ->all();


        $return = [];

        if ($data == null) {
            $return = [];
        } else {
            $return = array_map(create_function('$o', 'return $o->weather_types_id;'), $data);;
//            $return = array_column($data, 'weather_types_id');//doesn't work on server
        }

        return $return;
    }

    public function getMicroCategoryIds()
    {
        $data = ActivitiesMicroCategories::find()
            ->select(['system_micro_categories_id'])
            ->where(['activities_id' => $this->id])
            ->all();

        $return = [];

        if ($data == null) {
            $return = [];
        } else {
            $return = array_map(create_function('$o', 'return $o->system_micro_categories_id;'), $data);;
//            $return = array_column($data, 'system_micro_categories_id');
        }

        return $return;
    }

    public function getMacroCategoryIds()
    {
        $data = ActivitiesMacroCategories::find()
            ->select(['system_macro_categories_id'])
            ->where(['activities_id' => $this->id])
            ->all();

        $return = [];

        if ($data == null) {
            $return = [];
        } else {
            $return = array_map(create_function('$o', 'return $o->system_macro_categories_id;'), $data);;
//            $return = array_column($data, 'system_macro_categories_id');
        }

        return $return;
    }

}
