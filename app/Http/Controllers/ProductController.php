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
                        ->orderBy('order', 'desc')
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
                $imageOrder = $request->input('image_order', []);
                if (!is_array($imageOrder)) {
                    $imageOrder = json_decode($imageOrder, true) ?? [];
                }

                if (empty($imageOrder) || count($imageOrder) !== count($request->file('images'))) {
                    $imageOrder = array_keys($request->file('images'));
                }

                foreach ($imageOrder as $displayOrder => $originalIndex) {
                    if (isset($request->file('images')[$originalIndex])) {
                        $imageFile = $request->file('images')[$originalIndex];

                        $imageVersions = $this->imageService->handleMultipleImages(
                            [$imageFile],
                            'products',
                            null
                        );

                        $product->images()->create([
                            'image_versions' => $imageVersions,
                            'image_metadata' => [
                                'mime_type' => $imageFile->getMimeType(),
                                'size' => $imageFile->getSize()
                            ],
                            'order' => $displayOrder + 1
                        ]);
                    }
                }
            }

            if ($request->has('variants') && is_array($request->variants)) {
                foreach ($request->variants as $variant) {
                    $product->variants()->create([
                        'color_id' => $variant['color_id'],
                        'size_id' => $variant['size_id'],
                        'stock' => $variant['stock'],
                        'additional_price' => $variant['additional_price']
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('product.index')->with('success', 'Produto criado com sucesso!');
        } catch (Throwable $th) {
            DB::rollBack();

            if ($product->images->isNotEmpty()) {
                foreach ($product->images as $image) {
                    if (isset($image->image_versions['original'])) {
                        $this->imageService->deleteImage($image->image_versions['original']);
                    }
                }
            }

            Log::error('Falha ao criar produto.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
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
        $product->load(['images', 'qualities', 'variants']);;
        $categories = Category::all();
        $brands = Brand::all();
        $colors = Color::all();
        $sizes = Size::all();
        $qualities = Quality::all();
        sleep(1);
        return Inertia::render('admin/product/edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
            'colors' => $colors,
            'sizes' => $sizes,
            'qualities' => $qualities,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        DB::beginTransaction();

        try {
            $imagePaths = [];
            foreach ($product->images as $image) {
                $imageVersions = is_string($image->image_versions)
                    ? json_decode($image->image_versions, true)
                    : $image->image_versions;

                if (is_array($imageVersions)) {
                    foreach ($imageVersions as $version) {
                        if (isset($version['original'])) {
                            $imagePaths[] = $version['original'];
                        }
                    }
                } else {
                    if (isset($imageVersions['original'])) {
                        $imagePaths[] = $imageVersions['original'];
                    }
                }
            }

            if (!empty($imagePaths)) {
                $this->imageService->deleteMultipleImages($imagePaths);
            }

            $product->delete();
            DB::commit();

            return redirect()->route('product.index')->with('success', 'Produto excluído com sucesso!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir produto.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'product_id' => $product->id
            ]);

            return back()->with('error', 'Falha ao excluir produto. Por favor, contate o suporte.');
        }
    }
}
