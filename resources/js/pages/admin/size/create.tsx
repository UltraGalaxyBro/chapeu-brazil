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
    label: string,
}

const CreateSize = ({ onOpenChange, ...props }: DialogProps) => {
    const { data, setData, post, errors, reset, processing } = useForm<FormType>({
        name: "",
        label: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('size.store'), {
            onSuccess: () => {
                console.log('Success callback triggered');
                reset();
                onOpenChange?.(false);
            },
            onError: (errors) => {
                console.log('Error callback triggered:', errors);
            },
            onFinish: () => {
                console.log('Finish callback triggered');
            }
        });
    }
    console.log(route('size.store'));
    return (
        <Sheet onOpenChange={onOpenChange} {...props}>
            <SheetContent className="p-4">
                <SheetHeader>
                    <SheetTitle>Criando tamanho</SheetTitle>
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
                        <Label htmlFor="label">
                            Legenda
                        </Label>
                        <Input
                            id="label"
                            value={data.label}
                            onChange={(e) => setData("label", e.target.value)}
                            placeholder="P, M, G, etc..."
                            required
                        />
                        <InputError message={errors.label} />
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

export default CreateSize;