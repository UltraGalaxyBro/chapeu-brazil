"use client"

import { ColumnDef } from "@tanstack/react-table"
import { 
  Eraser, 
  Eye, 
  Image, 
  MoreHorizontal, 
  Pen, 
  Pencil 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ProductIndex } from "@/types"
import { Badge } from "@/components/ui/badge"

export const table = (
  onDelete: (product: ProductIndex) => void,
  onEdit: (product: ProductIndex) => void,
  onShow: (product: ProductIndex) => void
): ColumnDef<ProductIndex>[] => [
    {
      accessorKey: "thumbnail",
      header: () => <div className="text-center"><Image className="inline-block" size={18} /></div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.thumbnail ? (
            <img
              src={row.original.thumbnail}
              alt={row.original.name}
              className="w-8 h-8 rounded-sm inline-block object-cover"
            />
          ) : (
            <img
              src="/images/default.png"
              alt={row.original.name}
              className="w-8 h-8 rounded-sm inline-block object-cover"
            />
          )}
        </div>
      )
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ row }) => row.original.category?.name || '-'
    },
    {
      accessorKey: "price",
      header: "Preço",
    },
    {
      accessorKey: "total_stock",
      header: "Estoque",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge 
          variant={row.original.is_active ? "default" : "destructive"}
        >
          {row.original.is_active ? "Ativo" : "Inativo"}
        </Badge>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-center"><Pencil className="inline-block" size={18} /></div>,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onShow(product)}
                className="flex items-center gap-2 text-green-600 cursor-pointer">
                <Eye size={16} /> Ver
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(product)}
                className="flex items-center gap-2 text-blue-600 cursor-pointer">
                <Pen size={16} /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(product)}
                className="flex items-center gap-2 text-red-600 cursor-pointer">
                <Eraser size={16} /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];