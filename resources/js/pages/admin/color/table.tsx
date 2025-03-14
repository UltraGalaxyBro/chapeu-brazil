"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eraser, MoreHorizontal, Palette, Pen, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Color } from "@/types"

export const table = (
  onDelete: (color: Color) => void,
  onEdit: (color: Color) => void
): ColumnDef<Color>[] => [
    {
      accessorKey: "hexadecimal",
      header: () => <div className="text-center"><Palette className="inline-block" size={18} /></div>,
      cell: ({ row }) => (
        <div className="text-center">
          <div
            className="w-6 h-6 rounded-full mx-auto"
            style={{ backgroundColor: row.original.hexadecimal }}
            title={row.original.hexadecimal}
          />
        </div>
      )
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      id: "actions",
      header: () => <div className="text-center"><Pencil className="inline-block" size={18} /></div>,
      cell: ({ row }) => {
        const color = row.original;

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
                onClick={() => onEdit(color)}
                className="flex items-center gap-2 text-blue-600 cursor-pointer">
                <Pen size={16} /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(color)}
                className="flex items-center gap-2 text-red-600 cursor-pointer">
                <Eraser size={16} /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];