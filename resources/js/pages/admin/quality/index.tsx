import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useState } from 'react';
import { table } from "./table";
import ConfirmAlert from '@/components/confirm-alert';
import CreateQuality from './create';
import EditQuality from './edit';
import { BreadcrumbItem, Quality } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Qualidades',
    href: '/qualidades',
  },
];

interface IndexProps {
  qualities: Quality[]
}

export default function Index({ qualities }: IndexProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<Quality>();
  const [openCreateQuality, setOpenCreateQuality] = useState(false)
  const [openEditQuality, setOpenEditQuality] = useState(false)

  const handleDeleteClick = (quality: Quality) => {
    setSelectedQuality(quality);
    setOpenAlert(true);
  };

  const handleEditClick = (quality: Quality) => {
    setSelectedQuality(quality);
    setOpenEditQuality(true);
  };

  const handleDelete = () => {
    if (!selectedQuality) return;

    router.delete(route('quality.destroy', selectedQuality.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setSelectedQuality(undefined);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Qualidades" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className='mx-auto flex justify-end px-6 pb-6'>
            <Button onClick={() => setOpenCreateQuality(true)}>
              Criar qualidade
            </Button>
          </div>
          <div className="overflow-hidden bg-white dark:bg-[#171717] shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable columns={table(handleDeleteClick, handleEditClick)} data={qualities} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmAlert
        open={openAlert}
        onOpenChange={setOpenAlert}
        title="Confirmar exclusão"
        message="Você tem certeza que deseja excluir esta qualidade?"
        onConfirm={() => {
          handleDelete();
          setOpenAlert(false);
        }} />

      <CreateQuality
        open={openCreateQuality}
        onOpenChange={setOpenCreateQuality} />

      {selectedQuality && openEditQuality &&
        <EditQuality
          selected={selectedQuality}
          open={openEditQuality}
          onOpenChange={(openState) => {
            setSelectedQuality(undefined);
            setOpenEditQuality(openState)
          }} />
      }

    </AppLayout>
  );
}