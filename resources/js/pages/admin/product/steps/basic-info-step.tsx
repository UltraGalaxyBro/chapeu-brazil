import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import CurrencyInput from '@/components/currency-input';

type BasicInfoStepProps = {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
};

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, setData, errors }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Checkbox
            id="is_active"
            checked={data.is_active}
            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
          />
          <Label htmlFor="is_active" className="ml-2">
            Produto Ativo
          </Label>
        </div>
        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
          />
          <InputError message={errors.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={data.sku}
            onChange={(e) => setData("sku", e.target.value)}
            required
          />
          <InputError message={errors.sku} />
        </div>
        <div>
          <CurrencyInput
            id="cost"
            label="Custo"
            value={data.cost || 0}
            onChange={(value) => setData('cost', value)}
            className="text-center"
            required={true}
          />
          <InputError message={errors.cost} />
        </div>
        <div>
          <CurrencyInput
            id="price"
            label="Preço base"
            value={data.price || 0}
            onChange={(value) => setData('price', value)}
            className="text-center"
            required={true}
          />
          <InputError message={errors.price} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />
        <InputError message={errors.description} />
      </div>
    </div>
  );
};

export default BasicInfoStep;