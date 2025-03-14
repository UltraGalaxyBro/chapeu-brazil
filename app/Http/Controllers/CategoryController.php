<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Throwable;

class CategoryController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $categories = Category::latest()->get();
        return Inertia::render('admin/category/index', ['categories' => $categories]);
    }

    public function store(CategoryRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $validated['slug'] = Str::slug($request->name);

            if ($request->hasFile('image')) {
                $imageVersions = $this->imageService->handleSingleImage(
                    $request->file('image'),
                    'categories',
                    null
                );

                $validated['image_versions'] = $imageVersions;
            }

            Category::create($validated);

            DB::commit();

            return back()->with('success', 'Categoria criada!');
        } catch (Throwable $th) {
            DB::rollBack();

            if (isset($imageVersions)) {
                $this->imageService->deleteImage($imageVersions['original']);
            }

            Log::error('Falha ao criar categoria.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao criar categoria. Por favor, contate o suporte.');
        }
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $validated['slug'] = Str::slug($request->name);

            if ($request->hasFile('image')) {
                $oldImage = $category->image_versions['original'] ?? null;

                $newImageVersions = $this->imageService->handleSingleImage(
                    $request->file('image'),
                    'categories',
                    $oldImage
                );

                $validated['image_versions'] = $newImageVersions;
            }

            $category->update($validated);
            DB::commit();

            return back()->with('success', 'Categoria editada!');
        } catch (Throwable $th) {
            DB::rollBack();

            if (isset($newImageVersions)) {
                $this->imageService->deleteImage($newImageVersions['original']);
            }

            Log::error('Falha ao editar categoria.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao editar categoria. Por favor, contate o suporte.');
        }
    }

    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        DB::beginTransaction();
        try {
            if ($category->image_versions) {
                $this->imageService->deleteImage($category->image_versions['original']);
            }

            $category->delete();
            DB::commit();

            return back()->with('success', 'Categoria excluída!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir categoria.', [
                'category_id' => $th->$id,
                'error' => $th->getMessage(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Falha ao excluir categoria. Por favor, contate o suporte.');
        }
    }
}
