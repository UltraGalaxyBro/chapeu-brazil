<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Size;
use App\Models\Quality;
use App\Services\ImageService;
use App\Services\RequiredModelsValidatorService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Throwable;

class ProductController extends Controller
{
    protected $modelValidator, $imageService;

    public function __construct(RequiredModelsValidatorService $modelValidator, ImageService $imageService)
    {
        $this->modelValidator = $modelValidator;
        $this->imageService = $imageService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requiredModels = [
            'categoria' => Category::class,
            'marca' => Brand::class,
            'qualidade' => Quality::class,
            'cor' => Color::class,
            'tamanho' => Size::class,
        ];

        $missingItems = $this->modelValidator->validateModels($requiredModels);
        if ($missingItems) {
            $message = $this->modelValidator->createErrorMessage($missingItems);
            return back()->with('warning', $message);
        }

        $products = Product::select([
            'id',
            'name',
            'sku',
            'category_id',
            'price',
            'is_active',
            'created_at'
        ])
            ->with([
                'category:id,name',
                'images' => function ($query) {
                    $query->select(['id', 'product_id', 'image_versions'])
                        ->orderBy('order', 'asc')
                        ->take(1);
                }
            ])
            ->withSum('variants', 'stock')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name
                    ] : null,
                    'price' => number_format($product->price, 2, ',', '.'),
                    'is_active' => $product->is_active,
                    'created_at' => $product->created_at->format('d/m/Y H:i'),
                    'thumbnail' => $product->images->isNotEmpty()
                        ? ($product->images->first()->image_versions[0]['thumbnail'] ?? null)
                        : null,
                    'total_stock' => $product->variants_sum_stock ?? 0
                ];
            });

        return Inertia::render('admin/product/index', ['products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $requiredModels = [
            'categoria' => Category::class,
            'marca' => Brand::class,
            'qualidade' => Quality::class,
            'cor' => Color::class,
            'tamanho' => Size::class,
        ];

        $missingItems = $this->modelValidator->validateModels($requiredModels);
        if ($missingItems) {
            $message = $this->modelValidator->createErrorMessage($missingItems);
            return back()->with('warning', $message);
        }

        $categories = Category::all();
        $brands = Brand::all();
        $colors = Color::all();
        $sizes = Size::all();
        $qualities = Quality::all();
        sleep(1);

        return Inertia::render('admin/product/create', [
            'categories' => $categories,
            'brands' => $brands,
            'colors' => $colors,
            'sizes' => $sizes,
            'qualities' => $qualities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $validated['slug'] = Str::slug($request->name);

            $product = Product::create($validated);

            if ($request->has('qualities') && is_array($request->qualities)) {
                $product->qualities()->sync($request->qualities);
            }

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $imageOrder = [];

                if ($request->has('image_order')) {
                    $imageOrder = is_array($request->image_order)
                        ? $request->image_order
                        : json_decode($request->image_order, true);
                }

                $imageVersionsArray = $this->imageService->handleMultipleImages($files, 'products');

                foreach ($imageVersionsArray as $index => $imageVersions) {
                    $order = isset($imageOrder[$index]) ? $imageOrder[$index] : $index + 1;

                    $product->images()->create([
                        'image_versions' => [$imageVersions],
                        'image_metadata' => [
                            'mime_type' => $files[$index]->getMimeType(),
                            'size' => $files[$index]->getSize()
                        ],
                        'order' => $order
                    ]);
                }
            }

            if ($request->has('variants') && is_array($request->variants)) {
                foreach ($request->variants as $variantData) {
                    $product->variants()->create([
                        'color_id' => $variantData['color_id'],
                        'size_id' => $variantData['size_id'],
                        'stock' => $variantData['stock'],
                        'additional_price' => $variantData['additional_price']
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('product.index')->with('success', 'Produto criado com sucesso!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao criar produto.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all(),
                'files' => $request->file('images') ? array_map(fn($file) => $file->getClientOriginalName(), $request->file('images')) : [],
                'image_versions' => isset($imageVersionsArray) ? $imageVersionsArray : null,
            ]);

            return back()->with('error', 'Falha ao criar produto. Por favor, contate o suporte.');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $requiredModels = [
            'categoria' => Category::class,
            'marca' => Brand::class,
            'qualidade' => Quality::class,
            'cor' => Color::class,
            'tamanho' => Size::class,
        ];

        $missingItems = $this->modelValidator->validateModels($requiredModels);
        if ($missingItems) {
            $message = $this->modelValidator->createErrorMessage($missingItems);
            return back()->with('warning', $message);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {

        return inertia('admin/product/edit', [
            'product' => [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'brand_id' => $product->brand_id,
                'name' => $product->name,
                'sku' => $product->sku,
                'description' => $product->description,
                'cost' => $product->cost,
                'price' => $product->price,
                'is_active' => $product->is_active,
                'keywords' => $product->keywords,
                'qualities' => $product->qualities->map(fn($q) => ['id' => $q->id, 'name' => $q->name]),
                'variants' => $product->variants->map(fn($v) => [
                    'id' => $v->id,
                    'color_id' => $v->color_id,
                    'size_id' => $v->size_id,
                    'stock' => $v->stock,
                    'additional_price' => $v->additional_price,
                ]),
            ],
            'productImages' => $product->images->map(function ($image) {
                $versions = $image->image_versions;

                if (is_string($versions)) {
                    $versions = json_decode($versions, true) ?? [];
                }

                $versions = is_array($versions) ? $versions : [];
                $imageData = !empty($versions[0]) && is_array($versions[0]) ? $versions[0] : $versions;
                $path = $imageData['small'] ?? $imageData['original'] ?? null;
                $url = $path ? Storage::url($path) : asset('images/default-small.webp');

                return [
                    'id' => $image->id,
                    'path' => $url,
                    'order' => $image->order,
                ];
            }),
            'categories' => Category::all()->map(fn($c) => ['id' => $c->id, 'name' => $c->name]),
            'brands' => Brand::all()->map(fn($b) => ['id' => $b->id, 'name' => $b->name]),
            'colors' => Color::all()->map(fn($c) => ['id' => $c->id, 'name' => $c->name, 'hexadecimal' => $c->hexadecimal]),
            'sizes' => Size::all()->map(fn($s) => ['id' => $s->id, 'label' => $s->label]),
            'qualities' => Quality::all()->map(fn($q) => ['id' => $q->id, 'name' => $q->name]),
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $validated['slug'] = Str::slug($request->name);

            $product->update($validated);

            if ($request->has('qualities') && is_array($request->qualities)) {
                $product->qualities()->sync($request->qualities);
            } else {
                $product->qualities()->detach();
            }

            if ($request->has('existing_images')) {
                $existingImages = collect($request->existing_images)->pluck('id');

                $product->images()->whereNotIn('id', $existingImages)->each(function ($image) {
                    if (isset($image->image_versions['original'])) {
                        $this->imageService->deleteImage($image->image_versions['original']);
                    }
                    $image->delete();
                });

                foreach ($request->existing_images as $existingImage) {
                    $product->images()->where('id', $existingImage['id'])->update([
                        'order' => $existingImage['order']
                    ]);
                }
            } else {
                foreach ($product->images as $image) {
                    if (isset($image->image_versions['original'])) {
                        $this->imageService->deleteImage($image->image_versions['original']);
                    }
                    $image->delete();
                }
            }

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $imageOrder = [];

                if ($request->has('image_order')) {
                    $imageOrder = is_array($request->image_order)
                        ? $request->image_order
                        : json_decode($request->image_order, true);
                }

                $currentMaxOrder = $product->images()->max('order') ?? 0;

                foreach ($files as $index => $file) {
                    $imageVersions = $this->imageService->handleMultipleImages(
                        [$file],
                        'products'
                    );

                    $order = isset($imageOrder[$index])
                        ? $imageOrder[$index]
                        : $currentMaxOrder + $index + 1;

                    $product->images()->create([
                        'image_versions' => $imageVersions,
                        'image_metadata' => [
                            'mime_type' => $file->getMimeType(),
                            'size' => $file->getSize()
                        ],
                        'order' => $order
                    ]);
                }
            }

            if ($request->has('variants') && is_array($request->variants)) {
                $newVariantIds = [];
                foreach ($request->variants as $variantData) {
                    if (isset($variantData['id'])) {
                        $product->variants()->where('id', $variantData['id'])->update([
                            'color_id' => $variantData['color_id'],
                            'size_id' => $variantData['size_id'],
                            'stock' => $variantData['stock'],
                            'additional_price' => $variantData['additional_price']
                        ]);
                        $newVariantIds[] = $variantData['id'];
                    } else {
                        $newVariant = $product->variants()->create([
                            'color_id' => $variantData['color_id'],
                            'size_id' => $variantData['size_id'],
                            'stock' => $variantData['stock'],
                            'additional_price' => $variantData['additional_price']
                        ]);
                        $newVariantIds[] = $newVariant->id;
                    }
                }

                $product->variants()->whereNotIn('id', $newVariantIds)->delete();
            } else {
                $product->variants()->delete();
            }

            DB::commit();

            return redirect()->route('product.index')->with('success', 'Produto atualizado com sucesso!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao atualizar produto.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'product_id' => $product->id ?? 'N/A',
                'request_data' => $request->all(),
                'files' => $request->hasFile('images')
                    ? array_map(fn($file) => [
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ], $request->file('images'))
                    : [],
                'image_versions' => isset($imageVersionsArray) ? $imageVersionsArray : null,
                'image_order' => $request->has('image_order')
                    ? (is_array($request->image_order) ? $request->image_order : json_decode($request->image_order, true))
                    : null,
                'qualities' => $request->has('qualities') ? $request->qualities : null,
                'variants' => $request->has('variants') ? $request->variants : null,
            ]);

            return back()->with('error', 'Falha ao atualizar produto. Por favor, contate o suporte.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        DB::beginTransaction();

        try {
            $productImages = $product->images;

            foreach ($productImages as $productImage) {
                if (isset($productImage->image_versions) && !empty($productImage->image_versions)) {
                    $imageVersions = is_array($productImage->image_versions)
                        ? $productImage->image_versions
                        : json_decode($productImage->image_versions, true);

                    if (isset($imageVersions['original'])) {
                        $this->imageService->deleteImage($imageVersions['original']);
                    } else {
                        foreach ($imageVersions as $version) {
                            if (isset($version['original'])) {
                                $this->imageService->deleteImage($version['original']);
                            }
                        }
                    }
                }
            }

            $product->delete();

            DB::commit();

            return back()->with('success', 'Produto excluído com sucesso!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir produto.', [
                'product_id' => $product->id,
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString()
            ]);

            return back()->with('error', 'Falha ao excluir produto. Por favor, contate o suporte.');
        }
    }
}
