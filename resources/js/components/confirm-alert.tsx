import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogProps } from "@radix-ui/react-alert-dialog"

type Props = Omit<AlertDialogProps, 'open'> & {
    title: string,
    message: string,
    onConfirm: () => void,
    open: boolean
}

const ConfirmAlert = ({
    onOpenChange,
    onConfirm,
    message,
    title,
    open,
    ...props
}: Props) => {
    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
            {...props}
        >
            <AlertDialogContent className="top-[40%]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                            <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                                <p className="font-medium">{message}</p>
                                <p className="text-sm">Por favor, prossiga com cuidado, isso não pode ser desfeito.</p>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/80 text-white"
                        onClick={() => onConfirm?.()}>
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmAlert