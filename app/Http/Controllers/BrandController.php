<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandRequest;
use App\Models\Brand;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class BrandController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $brands = Brand::latest()->get();
        return Inertia::render('admin/brand/index', ['brands' => $brands]);
    }

    public function store(BrandRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {

            if ($request->hasFile('image')) {
                $imageVersions = $this->imageService->handleSingleImage(
                    $request->file('image'),
                    'brands',
                    null
                );

                $validated['image_versions'] = $imageVersions;
            }

            Brand::create($validated);

            DB::commit();

            return back()->with('success', 'Marca criada!');
        } catch (Throwable $th) {
            DB::rollBack();

            if (isset($imageVersions)) {
                $this->imageService->deleteImage($imageVersions['original']);
            }

            Log::error('Falha ao criar marca.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao criar marca. Por favor, contate o suporte.');
        }
    }

    public function update(BrandRequest $request, Brand $Brand)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {

            if ($request->hasFile('image')) {
                $oldImage = $Brand->image_versions['original'] ?? null;

                $newImageVersions = $this->imageService->handleSingleImage(
                    $request->file('image'),
                    'brands',
                    $oldImage
                );

                $validated['image_versions'] = $newImageVersions;
            }

            $Brand->update($validated);
            DB::commit();

            return back()->with('success', 'Marca editada!');
        } catch (Throwable $th) {
            DB::rollBack();

            if (isset($newImageVersions)) {
                $this->imageService->deleteImage($newImageVersions['original']);
            }

            Log::error('Falha ao editar marca.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao editar marca. Por favor, contate o suporte.');
        }
    }

    public function destroy(string $id)
    {
        $Brand = Brand::findOrFail($id);

        DB::beginTransaction();
        try {
            if ($Brand->image_versions) {
                $this->imageService->deleteImage($Brand->image_versions['original']);
            }

            $Brand->delete();
            DB::commit();

            return back()->with('success', 'Marca excluída!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir marca.', [
                'brand_id' => $th->$id,
                'error' => $th->getMessage(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Falha ao excluir marca. Por favor, contate o suporte.');
        }
    }
}
