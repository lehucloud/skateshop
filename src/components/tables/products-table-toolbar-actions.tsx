"use client"

import { type Table } from "@tanstack/react-table"
import { Download } from "lucide-react"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import ExtraProduct from "@/db/schema/products"

import { DeleteProductsDialog } from "./products-table-delete-dialog"
import { Icons } from "../icons"

import {useRouter} from 'next/navigation'

// import { DeleteTasksDialog } from "./delete-tasks-dialog"

interface TasksTableToolbarActionsProps {
    storeId: string
    table: Table<ExtraProduct>
}

export function ProductTableToolbarActions({
    storeId,
    table,
}: TasksTableToolbarActionsProps) {

    const router = useRouter() 

    return (
        <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <DeleteProductsDialog
                    products={table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original)}
                    onSuccess={() => table.toggleAllRowsSelected(false)} storeId={storeId}            />
        ) : null}
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    router.push(`/store/${storeId}/products/new`)
                }
                }
                className="gap-2"
            >
                <Icons.product className="mr-2 size-4" aria-hidden="true" />
                New
            </Button>
        </div>
    )
}