// Arquivo: components/products/steps/ImagesStep.tsx
import React from 'react';
import InputError from '@/components/input-error';

type ImagesStepProps = {
  data: any;
  errors: any;
  previewImages: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  mode: 'create' | 'edit';
};

const ImagesStep: React.FC<ImagesStepProps> = ({
  data,
  errors,
  previewImages,
  handleImageChange,
  removeImage,
  mode
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {mode === 'edit' ? 'Gerenciar Imagens do Produto' : 'Adicionar Imagens do Produto'}
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="product-images"
        />
        <label
          htmlFor="product-images"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Clique para selecionar imagens</p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
        </label>
      </div>

      {previewImages.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2">
            Pré-visualização ({previewImages.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-32 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <InputError message={errors.images} />
    </div>
  );
};

export default ImagesStep;