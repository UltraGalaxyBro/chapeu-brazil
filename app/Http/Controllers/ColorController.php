<?php

namespace App\Http\Controllers;

use App\Http\Requests\ColorRequest;
use App\Models\Color;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class ColorController extends Controller
{

    public function index()
    {
        $colors = Color::latest()->get();
        return Inertia::render('admin/color/index', ['colors' => $colors]);
    }

    public function store(ColorRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            Color::create($validated);
            DB::commit();

            return back()->with('success', 'Cor criada!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao criar cor.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao criar cor. Por favor, contate o suporte.');
        }
    }

    public function update(ColorRequest $request, Color $color)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $color->update($validated);
            DB::commit();

            return back()->with('success', 'Cor editada!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao editar cor.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao editar cor. Por favor, contate o suporte.');
        }
    }

    public function destroy(string $id)
    {
        $color = Color::findOrFail($id);

        DB::beginTransaction();
        try {
            $color->delete();
            DB::commit();

            return back()->with('success', 'Cor excluída!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir cor.', [
                'Color_id' => $th->$id,
                'error' => $th->getMessage(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Falha ao excluir cor. Por favor, contate o suporte.');
        }
    }
}
