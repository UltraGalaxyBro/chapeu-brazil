<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;

class ImageService
{
    private const QUALITY = 80;
    
    private const DIMENSIONS = [
        'thumbnail' => ['width' => 150, 'height' => 150],
        'small' => ['width' => 300, 'height' => 300],
        'medium' => ['width' => 600, 'height' => 600],
        'large' => ['width' => 1200, 'height' => 1200],
    ];

    /**
     * Processa uma única imagem (ex: imagem de categoria)
     */
    public function handleSingleImage(UploadedFile $image, string $path, string $oldImage = null): array
    {
        $filename = $this->generateFilename($image);
        
        $images = $this->processImage($image, $filename, $path);
        
        if ($oldImage) {
            $this->deleteImage($oldImage);
        }
        
        return $images;
    }

    /**
     * Processa múltiplas imagens (ex: imagens de produto)
     */
    public function handleMultipleImages(array $images, string $path): array
    {
        $processedImages = [];
        
        foreach ($images as $image) {
            $filename = $this->generateFilename($image);
            $processedImages[] = $this->processImage($image, $filename, $path);
        }
        
        return $processedImages;
    }

    /**
     * Processa uma imagem em diferentes tamanhos
     */
    private function processImage(UploadedFile $image, string $filename, string $path): array
    {
        $paths = [];
        
        foreach (self::DIMENSIONS as $size => $dimensions) {
            $processedImage = Image::read($image)
                ->scaleDown(
                    width: $dimensions['width'],
                    height: $dimensions['height']
                )
                ->toWebp(quality: self::QUALITY);
            
            $sizePath = "{$path}/{$size}";
            $fullPath = "{$sizePath}/{$filename}.webp";
            
            Storage::makeDirectory($sizePath);
            
            Storage::put($fullPath, (string) $processedImage);
            
            $paths[$size] = $fullPath;
        }
        
        $originalPath = "{$path}/original/{$filename}.webp";
        Storage::put(
            $originalPath,
            (string) Image::read($image)->toWebp(quality: self::QUALITY)
        );
        
        $paths['original'] = $originalPath;
        
        return $paths;
    }

    /**
     * Gera um nome único para a imagem
     */
    private function generateFilename(UploadedFile $image): string
    {
        return Str::uuid() . '_' . time();
    }

    /**
     * Remove uma imagem e todas suas variações
     */
    public function deleteImage(string $path): void
    {
        $basePath = Str::beforeLast(Str::beforeLast($path, '/'), '/');
        $filename = Str::afterLast($path, '/');
        
        foreach (self::DIMENSIONS as $size => $_) {
            Storage::delete("{$basePath}/{$size}/{$filename}");
        }
        
        Storage::delete("{$basePath}/original/{$filename}");
    }

    /**
     * Remove múltiplas imagens
     */
    public function deleteMultipleImages(array $paths): void
    {
        foreach ($paths as $path) {
            $this->deleteImage($path);
        }
    }
}