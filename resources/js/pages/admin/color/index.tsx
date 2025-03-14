import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useState } from 'react';
import { table } from "./table";
import ConfirmAlert from '@/components/confirm-alert';
import CreateColor from './create';
import EditColor from './edit';
import { BreadcrumbItem, Color } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Cores',
    href: '/cores',
  },
];

interface IndexProps {
  colors: Color[]
}

export default function Index({ colors }: IndexProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color>();
  const [openCreateColor, setOpenCreateColor] = useState(false)
  const [openEditColor, setOpenEditColor] = useState(false)

  const handleDeleteClick = (color: Color) => {
    setSelectedColor(color);
    setOpenAlert(true);
  };

  const handleEditClick = (color: Color) => {
    setSelectedColor(color);
    setOpenEditColor(true);
  };

  const handleDelete = () => {
    if (!selectedColor) return;

    router.delete(route('color.destroy', selectedColor.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setSelectedColor(undefined);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cores" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className='mx-auto flex justify-end px-6 pb-6'>
            <Button onClick={() => setOpenCreateColor(true)}>
              Criar cor
            </Button>
          </div>
          <div className="overflow-hidden bg-white dark:bg-[#171717] shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable columns={table(handleDeleteClick, handleEditClick)} data={colors} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmAlert
        open={openAlert}
        onOpenChange={setOpenAlert}
        title="Confirmar exclusão"
        message="Você tem certeza que deseja excluir esta cor?"
        onConfirm={() => {
          handleDelete();
          setOpenAlert(false);
        }} />

      <CreateColor
        open={openCreateColor}
        onOpenChange={setOpenCreateColor} />

      {selectedColor && openEditColor &&
        <EditColor
          selected={selectedColor}
          open={openEditColor}
          onOpenChange={(openState) => {
            setSelectedColor(undefined);
            setOpenEditColor(openState)
          }} />
      }

    </AppLayout>
  );
}