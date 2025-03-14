<?php

namespace App\Http\Controllers;

use App\Http\Requests\QualityRequest;
use App\Models\Quality;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class QualityController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $qualities = Quality::latest()->get();
        return Inertia::render('admin/quality/index', ['qualities' => $qualities]);
    }

    public function store(QualityRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {

            if ($request->hasFile('image')) {
                $imageVersions = $this->imageService->handleSingleImage(
                    $request->file('image'),
                    'qualities',
                    null
                );

                $validated['image_versions'] = $imageVersions;
            }

            Quality::create($validated);

            DB::commit();

            return back()->with('success', 'Qualidade criada!');
        } catch (Throwable $th) {
            DB::rollBack();

            if (isset($imageVersions)) {
                $this->imageService->deleteImage($imageVersions['original']);
            }

            Log::error('Falha ao criar qualidade.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao criar qualidade. Por favor, contate o suporte.');
        }
    }

    public function update(QualityRequest $request, Quality $quality)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {

            if ($request->hasFile('image')) {
                $oldImage = $quality->image_versions['original'] ?? null;

                $newImageVersions = $this->imageService->handleSingleImage(
                    $request->file('image'),
                    'qualities',
                    $oldImage
                );

                $validated['image_versions'] = $newImageVersions;
            }

            $quality->update($validated);
            DB::commit();

            return back()->with('success', 'Qualidade editada!');
        } catch (Throwable $th) {
            DB::rollBack();

            if (isset($newImageVersions)) {
                $this->imageService->deleteImage($newImageVersions['original']);
            }

            Log::error('Falha ao editar qualidade.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao editar qualidade. Por favor, contate o suporte.');
        }
    }

    public function destroy(string $id)
    {
        $quality = Quality::findOrFail($id);

        DB::beginTransaction();
        try {
            if ($quality->image_versions) {
                $this->imageService->deleteImage($quality->image_versions['original']);
            }

            $quality->delete();
            DB::commit();

            return back()->with('success', 'Qualidade excluída!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir qualidade.', [
                'quality_id' => $th->$id,
                'error' => $th->getMessage(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Falha ao excluir qualidade. Por favor, contate o suporte.');
        }
    }
}
