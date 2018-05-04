<?php

if (YII_DEBUG) {

    return [
        'class' => 'yii\db\Connection',
        'dsn' => 'mysql:host=localhost;dbname=dobedoo',
        'username' => 'root',
        'password' => 'mysql',
        'charset' => 'utf8',
    ];
} else {


    return [
        'class' => 'yii\db\Connection',
        'dsn' => 'mysql:host=esportami.cn1gigdrm4eb.us-west-2.rds.amazonaws.com;dbname=dobedoo_dev',
        'username' => 'esportami_admin',
        'password' => 'admin_esportami',
        'charset' => 'utf8',
    ];

}