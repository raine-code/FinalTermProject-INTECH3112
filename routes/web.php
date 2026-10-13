<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => Auth::check()
    ? redirect()->route('dashboard')
    : redirect()->route('login'));

require __DIR__ . '/dashboard.php';
require __DIR__ . '/requests.php';
require __DIR__ . '/inventory.php';
require __DIR__ . '/analytics.php';
require __DIR__ . '/users.php';
