<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'config/perfil');

    Route::get('config/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('config/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('config/perfil', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('config/senha', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('config/senha', [PasswordController::class, 'update'])->name('password.update');

    Route::get('config/visual', function () {
        return Inertia::render('admin/settings/appearance');
    })->name('appearance');
});
