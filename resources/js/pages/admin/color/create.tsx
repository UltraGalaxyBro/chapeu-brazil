import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@inertiajs/react";
import { DialogProps } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

type FormType = {
    name: string,
    hexadecimal: string,
}

const CreateColor = ({ onOpenChange, ...props }: DialogProps) => {
    const { data, setData, post, errors, reset, processing } = useForm<FormType>({
        name: "",
        hexadecimal: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('color.store'), {
            onSuccess: () => {
                reset();
                onOpenChange?.(false);
            }
        });
    }

    return (
        <Sheet onOpenChange={onOpenChange} {...props}>
            <SheetContent className="p-4">
                <SheetHeader>
                    <SheetTitle>Criando cor</SheetTitle>
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="description">
                                    Tonalidade
                                </Label>
                                <Input
                                    type="color"
                                    id="color"
                                    onChange={(e) => setData("hexadecimal", e.target.value)}
                                    className="w-24 h-10 p-1 cursor-pointer"
                                    required
                                />
                            </div>
                            <span className="text-sm text-gray-600 uppercase">
                                {data.hexadecimal || "#000000"}
                            </span>
                        </div>
                        <InputError message={errors.hexadecimal} />
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            {processing ? 'Criando...' : 'Criar'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default CreateColor;