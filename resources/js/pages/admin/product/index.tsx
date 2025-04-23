import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useState } from 'react';
import { table } from "./table";
import ConfirmAlert from '@/components/confirm-alert';
import { BreadcrumbItem, ProductIndex } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produtos',
        href: '/produtos',
    },
];

interface IndexProps {
    products: ProductIndex[]
}

export default function Index({ products }: IndexProps) {
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductIndex>();

    const createPage = () => {
        router.get(route('product.create'));
    }

    const handleShowClick = (product: ProductIndex) => {

        router.get(route('product.show', product.id));
    };

    const handleEditClick = (product: ProductIndex) => {

        router.get(route('product.edit', product.id));
    };

    const handleDeleteClick = (product: ProductIndex) => {
        setSelectedProduct(product);
        setOpenAlert(true);
    };

    const handleDelete = () => {
        if (!selectedProduct) return;

        router.delete(route('product.destroy', selectedProduct.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setSelectedProduct(undefined);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produtos" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className='mx-auto flex justify-end px-6 pb-6'>
                        <Button onClick={createPage}>
                            Criar produto
                        </Button>
                    </div>
                    <div className="overflow-hidden bg-white dark:bg-[#171717] shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <DataTable columns={table(handleShowClick, handleEditClick,handleDeleteClick)} data={products} />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmAlert
                open={openAlert}
                onOpenChange={setOpenAlert}
                title="Confirmar exclusão"
                message="Você tem certeza que deseja excluir este produto?"
                onConfirm={() => {
                    handleDelete();
                    setOpenAlert(false);
                }} />

        </AppLayout>
    );
}