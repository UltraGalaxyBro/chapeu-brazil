<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ColorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|unique:colors,name',
            'hexadecimal' => 'required|string|unique:colors,hexadecimal',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] .= ',' . $this->route('color')->id;
            $rules['hexadecimal'] .= ',' . $this->route('color')->id;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome da cor é obrigatório',
            'name.string' => 'O nome deve ser um texto',
            'name.unique' => 'Já existe uma cor com este nome',

            'hexadecimal.required' => 'O código hexadecimal é obrigatório',
            'hexadecimal.string' => 'O código hexadecimal deve ser um texto',
            'hexadecimal.unique' => 'Já existe uma cor com este código hexadecimal'
        ];
    }
}
