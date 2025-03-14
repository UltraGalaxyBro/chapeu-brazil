<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\QualityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/central', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::controller(CategoryController::class)->group(function () {
        Route::get('/categorias', 'index')->name('category.index');
        Route::post('/categorias', 'store')->name('category.store');
        Route::put('/categorias/{category}', 'update')->name('category.update');
        Route::delete('/categorias/{category}', 'destroy')->name('category.destroy');
    });

    Route::controller(BrandController::class)->group(function () {
        Route::get('/marcas', 'index')->name('brand.index');
        Route::post('/marcas', 'store')->name('brand.store');
        Route::put('/marcas/{brand}', 'update')->name('brand.update');
        Route::delete('/marcas/{brand}', 'destroy')->name('brand.destroy');
    });

    Route::controller(ColorController::class)->group(function () {
        Route::get('/cores', 'index')->name('color.index');
        Route::post('/cores', 'store')->name('color.store');
        Route::put('/cores/{color}', 'update')->name('color.update');
        Route::delete('/cores/{color}', 'destroy')->name('color.destroy');
    });

    Route::controller(SizeController::class)->group(function () {
        Route::get('/tamanhos', 'index')->name('size.index');
        Route::post('/tamanhos', 'store')->name('size.store');
        Route::put('/tamanhos/{size}', 'update')->name('size.update');
        Route::delete('/tamanhos/{size}', 'destroy')->name('size.destroy');
    });

    Route::controller(QualityController::class)->group(function () {
        Route::get('/qualidades', 'index')->name('quality.index');
        Route::post('/qualidades', 'store')->name('quality.store');
        Route::put('/qualidades/{quality}', 'update')->name('quality.update');
        Route::delete('/qualidades/{quality}', 'destroy')->name('quality.destroy');
    });

    Route::controller(ProductController::class)->group(function () {
        Route::get('/produtos', 'index')->name('product.index');
        Route::get('/produtos/criar', 'create')->name('product.create');
        Route::post('/produtos', 'store')->name('product.store');
        Route::get('/produtos/{product}/ver', 'show')->name('product.show');
        Route::get('/produtos/{product}/editar', 'edit')->name('product.edit');
        Route::put('/produtos/{product}', 'update')->name('product.update');
        Route::delete('/produtos/{product}', 'destroy')->name('product.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
