<?php

if (YII_DEBUG) {
    return [
        'class' => 'yii\db\Connection',
        'dsn' => 'mysql:host=localhost;dbname=dobedoo',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8',
    ];
} else {
    return [
        'class' => 'yii\db\Connection',
        'dsn' => 'mysql:host=dobedoobackenddb.ctxihhg1dmhh.us-east-2.rds.amazonaws.com;dbname=dobedoo',
        'username' => 'dobedoodbadmin',
        'password' => 'admindobedoodb',
        'charset' => 'utf8',
    ];

}