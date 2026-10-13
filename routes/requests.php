<?php

use App\Http\Controllers\RequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'permission:requests.view'])->group(function () {
    Route::get('/requests', [RequestController::class, 'index'])->name('requests.index');
});

Route::middleware(['auth', 'permission:requests.create'])->group(function () {
    Route::get('/requests/create', [RequestController::class, 'create'])->name('requests.create');
});

Route::middleware(['auth', 'permission:requests.view'])->group(function () {
    Route::get('/requests/{seedRequest}', [RequestController::class, 'show'])->name('requests.show');
});

Route::middleware(['auth', 'permission:requests.create'])->group(function () {
    Route::post('/requests', [RequestController::class, 'store'])->name('requests.store');
    Route::get('/requests/{seedRequest}/edit', [RequestController::class, 'edit'])->name('requests.edit');
    Route::match(['put', 'patch'], '/requests/{seedRequest}', [RequestController::class, 'update'])->name('requests.update');
    Route::delete('/requests/{seedRequest}', [RequestController::class, 'destroy'])->name('requests.destroy');
});

Route::middleware(['auth', 'permission:requests.approve'])->group(function () {
    Route::patch('/requests/{seedRequest}/status', [RequestController::class, 'updateStatus'])->name('requests.status');
    Route::patch('/requests/{seedRequest}/deadline', [RequestController::class, 'updateDeadline'])->name('requests.deadline');
});

Route::middleware(['auth', 'permission:requests.dispatch'])->group(function () {
    Route::get('/scanner/{seedRequest}', [RequestController::class, 'scanner'])->name('scanner.show');
    Route::post('/requests/{seedRequest}/dispatch', [RequestController::class, 'dispatch'])->name('requests.dispatch');
});
