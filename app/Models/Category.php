<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_versions',
    ];

    protected $casts = [
        'image_versions' => 'array',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
