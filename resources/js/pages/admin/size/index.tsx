import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useState } from 'react';
import { table } from "./table";
import ConfirmAlert from '@/components/confirm-alert';
import CreateSize from './create';
import EditSize from './edit';
import { BreadcrumbItem, Size } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tamanhos',
    href: '/tamanhos',
  },
];

interface IndexProps {
  sizes: Size[]
}

export default function Index({ sizes }: IndexProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [openCreateSize, setOpenCreateSize] = useState(false)
  const [openEditSize, setOpenEditSize] = useState(false)

  const handleDeleteClick = (size: Size) => {
    setSelectedSize(size);
    setOpenAlert(true);
  };

  const handleEditClick = (size: Size) => {
    setSelectedSize(size);
    setOpenEditSize(true);
  };

  const handleDelete = () => {
    if (!selectedSize) return;

    router.delete(route('size.destroy', selectedSize.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setSelectedSize(undefined);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tamanhos" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className='mx-auto flex justify-end px-6 pb-6'>
            <Button onClick={() => setOpenCreateSize(true)}>
              Criar tamanho
            </Button>
          </div>
          <div className="overflow-hidden bg-white dark:bg-[#171717] shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable columns={table(handleDeleteClick, handleEditClick)} data={sizes} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmAlert
        open={openAlert}
        onOpenChange={setOpenAlert}
        title="Confirmar exclusão"
        message="Você tem certeza que deseja excluir este tamanho?"
        onConfirm={() => {
          handleDelete();
          setOpenAlert(false);
        }} />

      <CreateSize
        open={openCreateSize}
        onOpenChange={setOpenCreateSize} />

      {selectedSize && openEditSize &&
        <EditSize
          selected={selectedSize}
          open={openEditSize}
          onOpenChange={(openState) => {
            setSelectedSize(undefined);
            setOpenEditSize(openState)
          }} />
      }

    </AppLayout>
  );
}