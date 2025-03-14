<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:png,jpg,jpeg,webp'
        ];

        if ($this->method() === 'PUT' || $this->method() === 'PATCH') {
            $element = $this->route('brand');
            $rules['name'] = 'required|string|unique:brands,name,' . $element->id;
        } else {
            $rules['name'] = 'required|string|unique:brands,name';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome da marca é obrigatório',
            'name.string' => 'O nome deve ser um texto',
            'name.unique' => 'Já existe uma marca com este nome',
            'description.string' => 'A descrição deve ser um texto',
            'image.file' => 'O arquivo deve ser uma imagem válida',
            'image.mimes' => 'A imagem deve ser do tipo: png, jpg, jpeg, webp ou svg'
        ];
    }
}
