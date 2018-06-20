<?php

if (YII_DEBUG) {
    return [
        'frontendURL' => 'http://localhost:4201/',
        'supportEmail' => 'info@dobedoo.it',
        'adminEmail' => 'admin@dobedoo.it',
        'jwtSecretCode' => 'someSecretKey',
        'user.passwordResetTokenExpire' => 3600,
    ];
} else {
    return [
        'frontendURL' => 'http://app.dobedoo.it/',
        'supportEmail' => 'info@dobedoo.it',
        'adminEmail' => 'admin@dobedoo.it',
        'jwtSecretCode' => 'someSecretKey',
        'user.passwordResetTokenExpire' => 3600,
    ];
}

