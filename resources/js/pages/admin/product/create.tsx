import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem, ProductRelated } from '@/types';
import { useEffect, useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Loader2, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import CurrencyInput from '@/components/currency-input';
import StockInput from '@/components/stock-input';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Criando produto',
        href: '/produtos/criar',
    },
];

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
    image_order: number[];
    variants: {
        color_id: number;
        size_id: number;
        stock: number;
        additional_price: number;
    }[];
};

export default function CreateProduct({ categories, brands, colors, sizes, qualities }: ProductRelated): React.ReactElement {
    const [currentStep, setCurrentStep] = useState(1);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const totalSteps = 4;

    const { data, setData, post, processing, errors, reset } = useForm<FormType>({
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
        image_order: [],
        variants: [],
    });

    const stepsWithErrors = useMemo(() => {
        const errorSteps = {
            1: false,
            2: false,
            3: false,
            4: false
        };

        if (errors.name || errors.sku || errors.cost || errors.price || errors.description) errorSteps[1] = true;
        if (errors.category_id || errors.brand_id || errors.keywords || errors.qualities) errorSteps[2] = true;
        if (errors.images || errors.image_order) errorSteps[3] = true;
        if (errors.variants) errorSteps[4] = true;

        return errorSteps;
    }, [errors]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = [...data.images];
            const newPreviews = [...previewImages];
            const newImageOrder = [...data.image_order];

            Array.from(e.target.files).forEach((file, idx) => {
                newImages.push(file);
                newPreviews.push(URL.createObjectURL(file));
                newImageOrder.push(newImages.length - 1);
            });

            setData({ ...data, images: newImages, image_order: newImageOrder });
            setPreviewImages(newPreviews);
            toast.success('Imagens adicionadas com sucesso!');
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...data.images];
        const newPreviews = [...previewImages];
        const newImageOrder = [...data.image_order];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        newImageOrder.splice(index, 1);
        const adjustedOrder = newImageOrder.map((order, idx) => idx);

        setData({ ...data, images: newImages, image_order: adjustedOrder });
        setPreviewImages(newPreviews);
        toast.success('Imagem removida com sucesso!');
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newImages = [...data.images];
        const newPreviews = [...previewImages];
        const newImageOrder = [...data.image_order];

        const [reorderedImage] = newImages.splice(result.source.index, 1);
        newImages.splice(result.destination.index, 0, reorderedImage);

        const [reorderedPreview] = newPreviews.splice(result.source.index, 1);
        newPreviews.splice(result.destination.index, 0, reorderedPreview);

        const [reorderedOrder] = newImageOrder.splice(result.source.index, 1);
        newImageOrder.splice(result.destination.index, 0, reorderedOrder);

        setData({ ...data, images: newImages, image_order: newImageOrder });
        setPreviewImages(newPreviews);
        toast.success('Ordem das imagens atualizada!');
    };

    const handleQualityToggle = (id: number) => {
        const qualities = [...data.qualities];
        const index = qualities.indexOf(id);
        if (index === -1) qualities.push(id);
        else qualities.splice(index, 1);
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
        toast.success('Variante adicionada!');
    };

    const generateVariants = () => {
        const newVariants = [];
        for (const color of colors) {
            for (const size of sizes) {
                newVariants.push({
                    color_id: color.id,
                    size_id: size.id,
                    stock: 1,
                    additional_price: 0,
                });
            }
        }
        setData('variants', newVariants);
        toast.success(`Geradas ${newVariants.length} variações automaticamente!`);
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
        toast.success('Variante removida!');
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!data.name) {
                    toast.error('O nome do produto é obrigatório.');
                    return false;
                }
                if (!data.sku) {
                    toast.error('O SKU é obrigatório.');
                    return false;
                }
                if (data.cost <= 0) {
                    toast.error('O custo deve ser maior que zero.');
                    return false;
                }
                if (data.price <= 0) {
                    toast.error('O preço deve ser maior que zero.');
                    return false;
                }
                toast.success('Informações básicas validadas!');
                return true;
            case 2:
                if (!data.category_id) {
                    toast.error('Selecione uma categoria.');
                    return false;
                }
                if (!data.brand_id) {
                    toast.error('Selecione uma marca.');
                    return false;
                }
                toast.success('Informações adicionais validadas!');
                return true;
            case 3:
                if (data.images.length === 0) {
                    toast.error('Adicione pelo menos uma imagem.');
                    return false;
                }
                toast.success('Imagens validadas!');
                return true;
            case 4:
                if (data.variants.length === 0) {
                    toast.error('Adicione pelo menos uma variante.');
                    return false;
                }
                toast.success('Variantes validadas!');
                return true;
            default:
                return true;
        }
    };

    const nextStep = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentStep < totalSteps && validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep === totalSteps && validateStep(currentStep)) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images') return;
                else if (key === 'image_order' || key === 'qualities' || key === 'variants') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            data.images.forEach((image, idx) => {
                formData.append(`images[${idx}]`, image);
            });

            post(route('product.store'), {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setPreviewImages([]);
                },
            });
        }
    };

    useEffect(() => {
        return () => previewImages.forEach(url => URL.revokeObjectURL(url));
    }, []);

    useEffect(() => {
        if (data.images.length > 0 && data.image_order.length === 0) {
            const initialOrder = Array.from({ length: data.images.length }, (_, idx) => idx);
            setData('image_order', initialOrder);
        }
    }, [data.images]);

    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const canSubmit = currentStep === totalSteps && data.variants.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produtos" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6">
                        <div className="flex justify-between mb-2 gap-2">
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 flex flex-col items-center ${
                                        index + 1 <= currentStep
                                            ? 'text-[#171717] dark:text-white'
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}
                                >
                                    <div
                                        className={`relative w-8 h-8 rounded-full flex items-center justify-center mb-1
                                        ${index + 1 < currentStep
                                            ? 'bg-[#171717] dark:bg-white text-white'
                                            : ''
                                        }
                                        ${index + 1 === currentStep
                                            ? 'bg-white dark:bg-gray-800 text-[#171717] dark:text-white border-2 border-[#171717] dark:border-white'
                                            : ''
                                        }
                                        ${index + 1 > currentStep
                                            ? 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600'
                                            : ''
                                        }`}
                                    >
                                        {index + 1 < currentStep ? (
                                            <Check className="w-5 h-5 text-white dark:text-black" />
                                        ) : (
                                            index + 1
                                        )}
                                        {stepsWithErrors[(index + 1) as keyof typeof stepsWithErrors] && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                <AlertCircle className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:block">
                                        {index === 0 && 'Básicas'}
                                        {index === 1 && 'Adicionais'}
                                        {index === 2 && 'Imagens'}
                                        {index === 3 && 'Variantes'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#171717] rounded-lg shadow-sm p-6">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                        />
                                        <Label htmlFor="is_active" className="ml-2">Produto Ativo</Label>
                                    </div>
                                    <div>
                                        <Label htmlFor="name">Nome do Produto</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData("name", e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={e => setData("sku", e.target.value)}
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
                                        className="min-h-[100px]"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                        <SelectItem key={category.id} value={category.id.toString()}>
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
                                                        <SelectItem key={brand.id} value={brand.id.toString()}>
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
                                        onChange={e => setData("keywords", e.target.value)}
                                    />
                                    <InputError message={errors.keywords} />
                                </div>
                                <div>
                                    <Label htmlFor="qualities">Qualidade(s)</Label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" id='qualities'>
                                        {qualities.map(tech => (
                                            <div
                                                key={tech.id}
                                                className={`border rounded-lg p-2 transition-all
                                                ${data.qualities.includes(tech.id)
                                                    ? 'border-gray-900 bg-gray-100 dark:border-white dark:bg-gray-800'
                                                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}`}
                                            >
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        className="cursor-pointer"
                                                        id={`tech_${tech.id}`}
                                                        checked={data.qualities.includes(tech.id)}
                                                        onCheckedChange={() => handleQualityToggle(tech.id)}
                                                    />
                                                    <Label 
                                                        htmlFor={`tech_${tech.id}`} 
                                                        className="ml-2 cursor-pointer truncate" 
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
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Imagens do Produto</h2>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                                        className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                                    >
                                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-gray-600">Clique para adicionar imagens</p>
                                        <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                                    </label>
                                </div>

                                {previewImages.length > 0 && (
                                    <div>
                                        <h3 className="text-md font-medium mb-3">
                                            Pré-visualização ({previewImages.length}) - Arraste para reordenar
                                        </h3>
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Droppable droppableId="images" direction="horizontal">
                                                {(provided) => (
                                                    <div
                                                        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {previewImages.map((src, index) => (
                                                            <Draggable key={index} draggableId={`image-${index}`} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="relative group border border-gray-200 rounded-md p-1"
                                                                    >
                                                                        <div className="relative">
                                                                            <div className="absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 text-xs rounded z-10">
                                                                                {index + 1}
                                                                            </div>
                                                                            <img
                                                                                src={src}
                                                                                alt={`Preview ${index}`}
                                                                                className="h-24 w-full object-cover rounded"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeImage(index)}
                                                                                className="absolute cursor-pointer top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                )}
                                <InputError message={errors.images} />
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <h2 className="text-lg font-semibold">Variantes do Produto</h2>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button type="button" onClick={addVariant} className="w-full sm:w-auto">
                                            Adicionar
                                        </Button>
                                        <Button 
                                            type="button" 
                                            onClick={generateVariants} 
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            Gerar Automático
                                        </Button>
                                    </div>
                                </div>

                                {data.variants.length === 0 ? (
                                    <div className="text-center py-6 rounded-lg bg-gray-50 dark:bg-[#171717]">
                                        <p className="text-gray-500">Nenhuma variante adicionada.</p>
                                        <p className="text-sm text-gray-400">Use os botões acima para começar.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.variants.map((variant, index) => (
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
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                    <div>
                                                        <Label htmlFor={`color_${index}`} className="mb-1">Cor</Label>
                                                        <Select
                                                            value={variant.color_id?.toString()}
                                                            onValueChange={(value) => updateVariant(index, 'color_id', parseInt(value))}
                                                        >
                                                            <SelectTrigger className="w-full" id={`color_${index}`}>
                                                                <SelectValue placeholder="Cor" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Cores</SelectLabel>
                                                                    {colors.map(color => (
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
                                                    <div>
                                                        <Label htmlFor={`size_${index}`} className="mb-1">Tamanho</Label>
                                                        <Select
                                                            value={variant.size_id?.toString()}
                                                            onValueChange={(value) => updateVariant(index, 'size_id', parseInt(value))}
                                                        >
                                                            <SelectTrigger className="w-full" id={`size_${index}`}>
                                                                <SelectValue placeholder="Tamanho" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Tamanhos</SelectLabel>
                                                                    {sizes.map(size => (
                                                                        <SelectItem key={size.id} value={size.id.toString()}>
                                                                            {size.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <StockInput
                                                            label='Estoque'
                                                            id={`stock_${index}`}
                                                            value={variant.stock}
                                                            onChange={(value) => updateVariant(index, 'stock', value)}
                                                            index={index}
                                                        />
                                                    </div>
                                                    <div>
                                                        <CurrencyInput
                                                            id={`additional_price_${index}`}
                                                            label="Preço Adicional"
                                                            value={variant.additional_price || 0}
                                                            onChange={(value) => updateVariant(index, 'additional_price', value)}
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
                        )}

                        <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                            <Button
                                type="button"
                                onClick={prevStep}
                                className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                                disabled={currentStep === 1}
                            >
                                Voltar
                            </Button>
                            {currentStep < totalSteps ? (
                                <Button type="button" onClick={nextStep} className="w-full sm:w-auto">
                                    Próximo
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || processing}
                                    className={`w-full sm:w-auto ${canSubmit ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    {processing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    {processing ? 'Criando...' : data.variants.length > 0 ? 'Criar produto' : 'Adicione uma variante'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}