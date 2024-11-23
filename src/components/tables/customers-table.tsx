"use client"

import * as React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import { formatDate, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"

import { type CustomUser } from "@/db/schema"

interface CustomersTableProps {
  promise: Promise<{
    data: CustomUser[]
    pageCount: number
  }>
  storeId: string
}

export function CustomersTable({ promise, storeId }: CustomersTableProps) {
  const { data, pageCount } = React.use(promise)
  
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<CustomUser, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      // {
      //   accessorKey: "totalSpent",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title="Total Spent" />
      //   ),
      //   cell: ({ cell }) =>
      //     formatPrice(cell.getValue() as number, {
      //       notation: "standard",
      //     }),
      // },
      // {
      //   accessorKey: "orderPlaced",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title="Order Placed" />
      //   ),
      // },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const slug = row.original.email
            ?.replace("@", `-${Math.random().toString(36).substring(2, 10)}-`)
            .replace(".com", "")

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/stores/${storeId}/customers/${slug}`}>
                    View orders
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [storeId]
  )

  
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields: [
      {
        value: "name",
        label: "Name",
      },
      // {
      //   value: "category",
      //   label: "Category",
      //   options: products.category.enumValues.map((category) => ({
      //     label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
      //     value: category,
      //   })),
      // },
    ],
  })

  return <DataTable table={table} />
}
