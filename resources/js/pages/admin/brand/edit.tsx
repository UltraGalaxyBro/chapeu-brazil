import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { router, useForm } from "@inertiajs/react";
import { DialogProps } from "@radix-ui/react-dialog";
import { CameraIcon, Loader2, UploadIcon } from "lucide-react";
import { Brand } from "@/types";
import { useState } from "react";

type FormType = {
    name: string,
    description: string,
    image: File | undefined
}

type Props = DialogProps & {
    selected: Brand;
}

const EditBrand = ({ onOpenChange, selected, ...props }: Props) => {
    const { data, setData, errors, reset, processing } = useForm<FormType>({
        name: selected.name,
        description: selected.description,
        image: undefined
    });

    const [previewImage, setPreviewImage] = useState<string | null>(
        selected.image_versions?.small || null
    );
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        router.post(route('brand.update', selected.id), {
            _method: 'put',
            ...data
        }, {
            onSuccess: () => {
                reset();
                onOpenChange?.(false);
                setPreviewImage(null);
            }
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("image", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    return (
        <Sheet onOpenChange={onOpenChange} {...props}>
            <SheetContent className="p-4">
                <SheetHeader>
                    <SheetTitle>Editando marca</SheetTitle>
                    <SheetDescription>
                        Preencha corretamente o máximo de campos para exibir as informações da melhor forma<br /> no e-commerce.
                    </SheetDescription>
                </SheetHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <Label htmlFor="name">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">
                            Descrição
                        </Label>

                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image">
                                Imagem
                            </Label>

                            <div className="relative group">
                                <label
                                    htmlFor="image"
                                    className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all hover:border-primary-500 hover:bg-gray-50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200"
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <UploadIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold text-primary-600">Clique para enviar</span> ou arraste até aqui
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Formatos: PNG, JPG, JPEG, WebP (Até 2MB)
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </div>

                            <InputError message={errors.image} />
                        </div>

                        {/* Preview da imagem */}
                        <div className="flex justify-center">
                            <div className="relative group w-32 h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img
                                    src={previewImage || selected.image_versions?.small || '/images/default-small.webp'}
                                    alt={previewImage ? "Prévia da nova imagem" : "Prévia da imagem atual"}
                                    className="w-full h-full object-cover bg-gray-100"
                                />

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <CameraIcon className="w-8 h-8 text-white/80" />
                                    <span className="sr-only">Clique para alterar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            {processing ? 'Editando...' : 'Editar'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default EditBrand;