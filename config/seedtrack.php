<?php

return [
    'admin' => [
        'username' => env('SEEDTRACK_ADMIN_USERNAME'),
        'first_name' => env('SEEDTRACK_ADMIN_FIRST_NAME', 'SeedTrack'),
        'last_name' => env('SEEDTRACK_ADMIN_LAST_NAME', 'Administrator'),
        'email' => env('SEEDTRACK_ADMIN_EMAIL'),
        'password' => env('SEEDTRACK_ADMIN_PASSWORD'),
    ],
];
