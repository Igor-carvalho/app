<?php

namespace app\models\database;

use app\models\User;
use Yii;

/**
 * This is the model class for table "user_profile".
 *
 * @property integer $user_id
 * @property string $facebook_auth
 * @property string $facebook_profile_id
 * @property string $google_auth
 * @property string $google_profile_id
 * @property string $first_name
 * @property string $last_name
 * @property string $full_name
 * @property string $profile_image
 * @property string $password
 * @property string $created_at
 * @property string $updated_at
 *
 * @property User $user
 */
class UserProfile extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_profile';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
            [['facebook_auth', 'google_auth', 'profile_image'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['facebook_profile_id', 'google_profile_id'], 'string', 'max' => 45],
            [['first_name', 'last_name'], 'string', 'max' => 200],
            [['full_name'], 'string', 'max' => 255],
            [['password'], 'string', 'max' => 150],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'user_id' => 'User ID',
            'facebook_auth' => 'Facebook Auth',
            'facebook_profile_id' => 'Facebook Profile ID',
            'google_auth' => 'Google Auth',
            'google_profile_id' => 'Google Profile ID',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'full_name' => 'Full Name',
            'profile_image' => 'Profile Image',
            'password' => 'Password',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
}
