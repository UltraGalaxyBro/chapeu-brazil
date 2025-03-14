"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BadgeAlert, BadgeCheck, Eraser, Image, MoreHorizontal, Pen, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Quality } from "@/types"

export const table = (
  onDelete: (quality: Quality) => void,
  onEdit: (quality: Quality) => void
): ColumnDef<Quality>[] => [
    {
      accessorKey: "image_versions.thumbnail",
      header: () => <div className="text-center"><Image className="inline-block" size={18} /></div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.image_versions?.thumbnail ? (
            <img
              src={row.original.image_versions.thumbnail}
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
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => {
        return row.original.description ? (
          <div className="text-center">
            <BadgeCheck className="text-green-800 inline-block" />
          </div>
        ) : (
          <div className="text-center">
            <BadgeAlert className="text-red-800 inline-block" />
          </div>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-center"><Pencil className="inline-block" size={18} /></div>,
      cell: ({ row }) => {
        const quality = row.original;

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
                onClick={() => onEdit(quality)}
                className="flex items-center gap-2 text-blue-600 cursor-pointer">
                <Pen size={16} /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(quality)}
                className="flex items-center gap-2 text-red-600 cursor-pointer">
                <Eraser size={16} /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];