<?php

use App\Http\Controllers\InventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'permission:inventory.view'])->get('/seeds', [InventoryController::class, 'index'])->name('seeds.index');

Route::resource('seeds', InventoryController::class)->except(['index'])->middleware(['auth', 'permission:inventory.manage']);
