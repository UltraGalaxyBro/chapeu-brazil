<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $rules = [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cost' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'keywords' => ['nullable', 'string', 'max:255'],
            'qualities' => ['nullable', 'array'],
            'qualities.*' => ['integer', 'exists:qualities,id'],
            
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.color_id' => ['required', 'integer', 'exists:colors,id'],
            'variants.*.size_id' => ['required', 'integer', 'exists:sizes,id'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.additional_price' => ['numeric', 'min:0'],
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $element = $this->route('product');

            $rules['sku'] = ['required', 'string', 'max:100', 'unique:products,sku,' . $element->id];
            $rules['images'] = ['nullable', 'array'];
        } else {
            $rules['sku'] = ['required', 'string', 'max:100', 'unique:products,sku'];
            $rules['images'] = ['required', 'array', 'min:1'];
        }
        
        $rules['images.*'] = ['file', 'image', 'max:10240'];
        
        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes()
    {
        return [
            'category_id' => 'categoria',
            'brand_id' => 'marca',
            'name' => 'nome do produto',
            'sku' => 'SKU',
            'description' => 'descrição',
            'cost' => 'custo',
            'price' => 'preço base',
            'is_active' => 'produto ativo',
            'keywords' => 'palavras-chave',
            'qualities' => 'qualidades',
            'qualities.*' => 'qualidade',
            'images' => 'imagens',
            'images.*' => 'imagem',
            'variants' => 'variantes',
            'variants.*.color_id' => 'cor',
            'variants.*.size_id' => 'tamanho',
            'variants.*.stock' => 'estoque',
            'variants.*.additional_price' => 'preço adicional',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'category_id.required' => 'A categoria é obrigatória.',
            'brand_id.required' => 'A marca é obrigatória.',
            'name.required' => 'O nome do produto é obrigatório.',
            'sku.required' => 'O SKU é obrigatório.',
            'sku.unique' => 'Este SKU já está em uso.',
            'cost.required' => 'O custo é obrigatório.',
            'cost.min' => 'O custo deve ser maior ou igual a zero.',
            'price.required' => 'O preço base é obrigatório.',
            'price.min' => 'O preço base deve ser maior ou igual a zero.',
            'images.required' => 'Adicione pelo menos uma imagem do produto.',
            'images.min' => 'Adicione pelo menos uma imagem do produto.',
            'images.*.max' => 'A imagem não pode ter mais de 10MB.',
            'variants.required' => 'Adicione pelo menos uma variante do produto.',
            'variants.min' => 'Adicione pelo menos uma variante do produto.',
            'variants.*.color_id.required' => 'Selecione uma cor para a variante.',
            'variants.*.size_id.required' => 'Selecione um tamanho para a variante.',
            'variants.*.stock.required' => 'Informe o estoque da variante.',
            'variants.*.stock.min' => 'O estoque deve ser maior ou igual a zero.',
            'variants.*.additional_price.min' => 'O preço adicional deve ser maior ou igual a zero.',
        ];
    }
}
