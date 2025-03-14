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
import { router, useForm } from "@inertiajs/react";
import { DialogProps } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { Size } from "@/types";

type FormType = {
    name: string,
    label: string,
}

type Props = DialogProps & {
    selected: Size;
}

const EditSize = ({ onOpenChange, selected, ...props }: Props) => {
    const { data, setData, errors, reset, processing } = useForm<FormType>({
        name: selected.name,
        label: selected.label,
    });

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault();
 
         router.post(route('size.update', selected.id), {
             _method: 'put',
             ...data
         }, {
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
                    <SheetTitle>Editando tamanho</SheetTitle>
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
                            {processing ? 'Editando...' : 'Editar'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default EditSize;