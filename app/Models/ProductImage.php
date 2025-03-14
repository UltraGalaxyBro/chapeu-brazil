<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_versions',
        'image_metadata',
        'order',
    ];

    protected $casts = [
        'image_versions' => 'array',
        'image_metadata' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
