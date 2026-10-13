<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'permission:users.manage'])
    ->get('/users', [UserController::class, 'index'])
    ->name('users.index');
