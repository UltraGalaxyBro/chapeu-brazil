<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SizeRequest extends FormRequest
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
            'name' => 'required|string|unique:sizes,name',
            'label' => 'required|string|unique:sizes,label',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] .= ',' . $this->route('size')->id;
            $rules['label'] .= ',' . $this->route('size')->id;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do tamanho é obrigatório',
            'name.string' => 'O nome deve ser um texto',
            'name.unique' => 'Já existe um tamanho com este nome',

            'hexadecimal.required' => 'A legenda é obrigatório',
            'label.string' => 'A legenda deve ser um texto',
            'label.unique' => 'Já existe um tamanho com esta legenda'
        ];
    }
}
