import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useState } from 'react';
import { table } from "./table";
import ConfirmAlert from '@/components/confirm-alert';
import EditBrand from './edit';
import { Brand, BreadcrumbItem } from '@/types';
import CreateBrand from '../brand/create';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Marcas',
    href: '/marcas',
  },
];

interface IndexProps {
  brands: Brand[]
}

export default function Index({ brands }: IndexProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand>();
  const [openCreateBrand, setOpenCreateBrand] = useState(false)
  const [openEditBrand, setOpenEditBrand] = useState(false)

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpenAlert(true);
  };

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpenEditBrand(true);
  };

  const handleDelete = () => {
    if (!selectedBrand) return;

    router.delete(route('brand.destroy', selectedBrand.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setSelectedBrand(undefined);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Marcas" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className='mx-auto flex justify-end px-6 pb-6'>
            <Button onClick={() => setOpenCreateBrand(true)}>
              Criar marca
            </Button>
          </div>
          <div className="overflow-hidden bg-white dark:bg-[#171717] shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable columns={table(handleDeleteClick, handleEditClick)} data={brands} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmAlert
        open={openAlert}
        onOpenChange={setOpenAlert}
        title="Confirmar exclusão"
        message="Você tem certeza que deseja excluir esta marca?"
        onConfirm={() => {
          handleDelete();
          setOpenAlert(false);
        }} />

      <CreateBrand
        open={openCreateBrand}
        onOpenChange={setOpenCreateBrand} />

      {selectedBrand && openEditBrand &&
        <EditBrand
          selected={selectedBrand}
          open={openEditBrand}
          onOpenChange={(openState) => {
            setSelectedBrand(undefined);
            setOpenEditBrand(openState)
          }} />
      }

    </AppLayout>
  );
}