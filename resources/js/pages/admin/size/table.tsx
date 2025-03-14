"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eraser, MoreHorizontal, Pen, Pencil, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Size } from "@/types"

export const table = (
    onDelete: (size: Size) => void,
    onEdit: (size: Size) => void
): ColumnDef<Size>[] => [
        {
            accessorKey: "label",
            header: () => <div className="text-center"><Ruler className="inline-block" size={18} /></div>
        },
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            id: "actions",
            header: () => <div className="text-center"><Pencil className="inline-block" size={18} /></div>,
            cell: ({ row }) => {
                const size = row.original;

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
                                onClick={() => onEdit(size)}
                                className="flex items-center gap-2 text-blue-600 cursor-pointer">
                                <Pen size={16} /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(size)}
                                className="flex items-center gap-2 text-red-600 cursor-pointer">
                                <Eraser size={16} /> Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];