// Arquivo: components/products/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { BreadcrumbItem, ProductRelated } from '@/types';
import { Check, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import BasicInfoStep from './steps/basic-info-step';
import AdditionalInfoStep from './steps/additional-info-step';
import ImagesStep from './steps/images-step';
import VariantsStep from './steps/variants-step';


type ProductFormProps = {
  mode: 'create' | 'edit';
  product?: any;
  categories: any[];
  brands: any[];
  colors: any[];
  sizes: any[];
  qualities: any[];
  submitUrl: string;
  successCallback?: () => void;
};

type FormType = {
  category_id: number;
  brand_id: number;
  name: string;
  sku: string;
  description: string;
  cost: number;
  price: number;
  is_active: boolean;
  keywords: string;
  qualities: number[];
  images: File[];
  variants: {
    color_id: number;
    size_id: number;
    stock: number;
    additional_price: number;
  }[];
};

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  product,
  categories,
  brands,
  colors,
  sizes,
  qualities,
  submitUrl,
  successCallback
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const totalSteps = 4;

  // Inicializar o formulário com dados existentes ou valores padrão
  const { data, setData, post, processing, errors, reset } = useForm<FormType>(
    mode === 'edit' && product
      ? {
          // Preencher com dados do produto existente para modo edição
          category_id: product.category_id,
          brand_id: product.brand_id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          cost: product.cost,
          price: product.price,
          is_active: product.is_active,
          keywords: product.keywords,
          qualities: product.qualities?.map((tech: any) => tech.id) || [],
          images: [], // Imagens existentes serão tratadas de forma diferente
          variants: product.variants || [],
        }
      : {
          // Valores padrão para modo criação
          category_id: categories[0]?.id || 0,
          brand_id: brands[0]?.id || 0,
          name: '',
          sku: '',
          description: '',
          cost: 0,
          price: 0,
          is_active: true,
          keywords: '',
          qualities: [],
          images: [],
          variants: [],
        }
  );

  // Carregar pré-visualizações de imagens existentes para modo edição
  useEffect(() => {
    if (mode === 'edit' && product?.images?.length > 0) {
      setPreviewImages(product.images.map((img: any) => img.url));
    }

    return () => {
      previewImages.forEach(url => {
        // Apenas revogar URLs criados localmente, não URLs de imagens já salvas
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...data.images];
      const newPreviews = [...previewImages];

      Array.from(e.target.files).forEach(file => {
        newImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });

      setData('images', newImages);
      setPreviewImages(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...data.images];
    const newPreviews = [...previewImages];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setData('images', newImages);
    setPreviewImages(newPreviews);
  };

  const handleQualityToggle = (id: number) => {
    const qualities = [...data.qualities];
    const index = qualities.indexOf(id);

    if (index === -1) {
      qualities.push(id);
    } else {
      qualities.splice(index, 1);
    }

    setData('qualities', qualities);
  };

  const addVariant = () => {
    const newVariant = {
      color_id: colors[0]?.id || 0,
      size_id: sizes[0]?.id || 0,
      stock: 1,
      additional_price: 0,
    };

    setData('variants', [...data.variants, newVariant]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...data.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setData('variants', updatedVariants);
  };

  const removeVariant = (index: number) => {
    const updatedVariants = [...data.variants];
    updatedVariants.splice(index, 1);
    setData('variants', updatedVariants);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'edit' && product) {
      post(`${submitUrl}/${product.id}`, {
        onSuccess: () => {
          if (successCallback) successCallback();
        },
      });
    } else {
      post(submitUrl, {
        onSuccess: () => {
          reset();
          setPreviewImages([]);
          if (successCallback) successCallback();
        },
      });
    }
  };

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index + 1 <= currentStep
                    ? 'text-[#171717] dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                    ${
                      index + 1 < currentStep
                        ? 'bg-[#171717] dark:bg-white text-white'
                        : ''
                    }
                    ${
                      index + 1 === currentStep
                        ? 'bg-white dark:bg-gray-800 text-[#171717] dark:text-white border-2 border-[#171717] dark:border-white'
                        : ''
                    }
                    ${
                      index + 1 > currentStep
                        ? 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600'
                        : ''
                    }
                  `}
                >
                  {index + 1 < currentStep ? (
                    <Check className="w-5 h-5 text-white dark:text-black" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs font-medium">
                  {index === 0 && 'Informações Básicas'}
                  {index === 1 && 'Informações Adicionais'}
                  {index === 2 && 'Imagens'}
                  {index === 3 && 'Variantes'}
                </span>
              </div>
            ))}
          </div>

          <Progress value={progressPercentage} className="h-2" />
        </div>

        <form onSubmit={submitForm}>
          {currentStep === 1 && (
            <BasicInfoStep
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <AdditionalInfoStep
              data={data}
              setData={setData}
              errors={errors}
              categories={categories}
              brands={brands}
              qualities={qualities}
              handleQualityToggle={handleQualityToggle}
            />
          )}

          {currentStep === 3 && (
            <ImagesStep
              data={data}
              errors={errors}
              previewImages={previewImages}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              mode={mode}
            />
          )}

          {currentStep === 4 && (
            <VariantsStep
              data={data}
              errors={errors}
              colors={colors}
              sizes={sizes}
              addVariant={addVariant}
              updateVariant={updateVariant}
              removeVariant={removeVariant}
            />
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
              disabled={currentStep === 1}
            >
              Voltar
            </Button>

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Próximo
              </Button>
            ) : (
              data.variants.length > 0 ? (
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {processing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {processing ? (mode === 'edit' ? 'Atualizando...' : 'Criando...') : (mode === 'edit' ? 'Atualizar produto' : 'Criar produto')}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={true}
                  className="bg-gray-400 cursor-not-allowed"
                >
                  Adicione pelo menos uma variante
                </Button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;