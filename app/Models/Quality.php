<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quality extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_versions',
    ];

    protected $casts = [
        'image_versions' => 'array',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class)
            ->withTimestamps();
    }
}
