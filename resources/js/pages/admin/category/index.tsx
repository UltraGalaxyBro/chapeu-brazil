import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useState } from 'react';
import { table } from "./table";
import ConfirmAlert from '@/components/confirm-alert';
import CreateCategory from './create';
import EditCategory from './edit';
import { BreadcrumbItem, Category } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categorias',
    href: '/categorias',
  },
];

interface IndexProps {
  categories: Category[]
}

export default function Index({ categories }: IndexProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [openCreateCategory, setOpenCreateCategory] = useState(false)
  const [openEditCategory, setOpenEditCategory] = useState(false)

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setOpenAlert(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setOpenEditCategory(true);
  };

  const handleDelete = () => {
    if (!selectedCategory) return;

    router.delete(route('category.destroy', selectedCategory.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setSelectedCategory(undefined);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categorias" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className='mx-auto flex justify-end px-6 pb-6'>
            <Button onClick={() => setOpenCreateCategory(true)}>
              Criar categoria
            </Button>
          </div>
          <div className="overflow-hidden bg-white dark:bg-[#171717] shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable columns={table(handleDeleteClick, handleEditClick)} data={categories} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmAlert
        open={openAlert}
        onOpenChange={setOpenAlert}
        title="Confirmar exclusão"
        message="Você tem certeza que deseja excluir esta categoria?"
        onConfirm={() => {
          handleDelete();
          setOpenAlert(false);
        }} />

      <CreateCategory
        open={openCreateCategory}
        onOpenChange={setOpenCreateCategory} />

      {selectedCategory && openEditCategory &&
        <EditCategory
          selected={selectedCategory}
          open={openEditCategory}
          onOpenChange={(openState) => {
            setSelectedCategory(undefined);
            setOpenEditCategory(openState)
          }} />
      }

    </AppLayout>
  );
}