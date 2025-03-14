<?php

namespace App\Http\Controllers;

use App\Http\Requests\SizeRequest;
use App\Models\Size;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class SizeController extends Controller
{

    public function index()
    {
        $sizes = Size::latest()->get();
        return Inertia::render('admin/size/index', ['sizes' => $sizes]);
    }

    public function store(SizeRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            Size::create($validated);
            DB::commit();

            return back()->with('success', 'Tamanho criado!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao criar tamanho.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao criar tamanho. Por favor, contate o suporte.');
        }
    }

    public function update(SizeRequest $request, Size $size)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $size->update($validated);
            DB::commit();

            return back()->with('success', 'Tamanho editado!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao editar tamanho.', [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->with('error', 'Falha ao editar tamanho. Por favor, contate o suporte.');
        }
    }

    public function destroy(string $id)
    {
        $Size = Size::findOrFail($id);

        DB::beginTransaction();
        try {
            $Size->delete();
            DB::commit();

            return back()->with('success', 'Tamanho excluído!');
        } catch (Throwable $th) {
            DB::rollBack();

            Log::error('Falha ao excluir tamanho.', [
                'size_id' => $th->$id,
                'error' => $th->getMessage(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Falha ao excluir tamanho. Por favor, contate o suporte.');
        }
    }
}
