// Arquivo: components/products/steps/VariantsStep.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import CurrencyInput from '@/components/currency-input';
import StockInput from '@/components/stock-input';

type VariantsStepProps = {
  data: any;
  errors: any;
  colors: any[];
  sizes: any[];
  addVariant: () => void;
  updateVariant: (index: number, field: string, value: any) => void;
  removeVariant: (index: number) => void;
};

const VariantsStep: React.FC<VariantsStepProps> = ({
  data,
  errors,
  colors,
  sizes,
  addVariant,
  updateVariant,
  removeVariant,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Variantes do Produto</h2>
        <Button type="button" onClick={addVariant}>
          Adicionar Variante
        </Button>
      </div>

      {data.variants.length === 0 ? (
        <div className="text-center py-6 rounded-lg">
          <p className="text-gray-500">Nenhuma variante adicionada.</p>
          <p className="text-sm text-gray-400">
            Clique em "Adicionar Variante" para começar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.variants.map((variant: any, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Variante #{index + 1}</h3>
                <Button
                  type="button"
                  onClick={() => removeVariant(index)}
                  variant="ghost"
                  className="text-red-500 hover:text-white hover:bg-red-500 p-1 h-auto"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <Label htmlFor={`color_${index}`} className="mb-2">
                    Cor
                  </Label>
                  <Select
                    value={variant.color_id?.toString()}
                    onValueChange={(value) =>
                      updateVariant(index, 'color_id', parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className="w-full text-center"
                      id={`color_${index}`}
                    >
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Cores</SelectLabel>
                        {colors.map((color) => (
                          <SelectItem
                            key={color.id}
                            value={color.id.toString()}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.hexadecimal }}
                            />
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col items-center">
                  <Label htmlFor={`size_${index}`} className="mb-2">
                    Tamanho
                  </Label>
                  <Select
                    value={variant.size_id?.toString()}
                    onValueChange={(value) =>
                      updateVariant(index, 'size_id', parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className="w-full text-center"
                      id={`size_${index}`}
                    >
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tamanhos</SelectLabel>
                        {sizes.map((size) => (
                          <SelectItem
                            key={size.id}
                            value={size.id.toString()}
                          >
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col items-center">
                  <StockInput
                    label="Estoque"
                    id={`stock_${index}`}
                    value={variant.stock}
                    onChange={(value) =>
                      updateVariant(index, 'stock', value)
                    }
                    index={index}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <CurrencyInput
                    id={`additional_price_${index}`}
                    label="Preço Adicional"
                    value={variant.additional_price || 0}
                    onChange={(value) =>
                      updateVariant(index, 'additional_price', value)
                    }
                    className="text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <InputError message={errors.variants} />
    </div>
  );
};

export default VariantsStep;