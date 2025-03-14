// Arquivo: components/products/steps/AdditionalInfoStep.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdditionalInfoStepProps = {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  categories: any[];
  brands: any[];
  qualities: any[];
  handleQualityToggle: (id: number) => void;
};

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  data,
  setData,
  errors,
  categories,
  brands,
  qualities,
  handleQualityToggle,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category_id">Categoria</Label>
          <Select
            value={data.category_id?.toString()}
            onValueChange={(value) => setData('category_id', parseInt(value))}
          >
            <SelectTrigger className="w-full" id="category_id">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputError message={errors.category_id} />
        </div>
        <div>
          <Label htmlFor="brand_id">Marca</Label>
          <Select
            value={data.brand_id?.toString()}
            onValueChange={(value) => setData('brand_id', parseInt(value))}
          >
            <SelectTrigger className="w-full" id="brand_id">
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Marcas</SelectLabel>
                {brands.map((brand) => (
                  <SelectItem
                    key={brand.id}
                    value={brand.id.toString()}
                  >
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputError message={errors.brand_id} />
        </div>
      </div>

      <div>
        <Label htmlFor="keywords">Palavras-chave</Label>
        <Input
          id="keywords"
          placeholder="Separe as palavras-chave com vírgulas"
          value={data.keywords}
          onChange={(e) => setData("keywords", e.target.value)}
        />
        <InputError message={errors.keywords} />
      </div>
      
      <div>
        <Label htmlFor="qualities">Qualidade(s)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" id="qualities">
          {qualities.map((tech) => (
            <div
              key={tech.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all
                ${
                  data.qualities.includes(tech.id)
                    ? 'border-gray-900 bg-gray-100 dark:border-white dark:bg-gray-800'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
            >
              <div className="flex items-center">
                <Checkbox
                  id={`tech_${tech.id}`}
                  checked={data.qualities.includes(tech.id)}
                  onCheckedChange={() => handleQualityToggle(tech.id)}
                />
                <Label
                  htmlFor={`tech_${tech.id}`}
                  className="ml-2"
                  onClick={() => handleQualityToggle(tech.id)}
                >
                  {tech.name}
                </Label>
              </div>
            </div>
          ))}
        </div>
        <InputError message={errors.qualities} />
      </div>
    </div>
  );
};

export default AdditionalInfoStep;