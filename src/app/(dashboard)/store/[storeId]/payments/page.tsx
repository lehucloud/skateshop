import * as React from "react"
import { type Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { categories, products, stores, type Product } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from "drizzle-orm"

import { storesProductsSearchParamsSchema } from "@/lib/validations/params"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { ProductsTable } from "@/components/tables/products-table"
import { getProducts, getCategories } from "@/lib/queries/product"
import { Skeleton } from "@/components/ui/skeleton"
export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: "Products",
    description: "Manage your products",
}

interface ProductsPageProps {
    params: {
        storeId: string
    }
    searchParams: SearchParams
}

export default async function ProductsPage({
    params,
    searchParams,
}: ProductsPageProps) {
    const storeId = decodeURIComponent(params.storeId)

    // Parse search params using zod schema
    const { page, per_page, sort, name, category, from, to } =
        storesProductsSearchParamsSchema.parse(searchParams)

    const store = await db.query.stores.findFirst({
        where: eq(stores.id, storeId),
        columns: {
            id: true,
            name: true,
        },
    })

    if (!store) {
        notFound()
    }

    // Fallback page for invalid page numbers
    const fallbackPage = isNaN(page) || page < 1 ? 1 : page
    // Number of items per page
    const limit = isNaN(per_page) ? 10 : per_page
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
    // Column and order to sort by
    const [column, order] = (sort?.split(".") as [
        keyof Product | undefined,
        "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"]

    const categoryIds = category?.split(".") ?? []

    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined

    const productsPromise = getProducts(searchParams);

    // convert AwaitedProduct

    const categoriesPromise = getCategories();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
                    <DateRangePicker
                        triggerSize="sm"
                        triggerClassName="ml-auto w-56 sm:w-60"
                        align="end"
                    />
                    {/* <DateRangePicker align="end" /> */}
                </React.Suspense>
            </div>
            <React.Suspense fallback={<DataTableSkeleton columnCount={6} searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
                shrinkZero />}>
                <ProductsTable promise={productsPromise} storeId={storeId} categoriesPromise={categoriesPromise} />
            </React.Suspense>
        </div>
    )
}
