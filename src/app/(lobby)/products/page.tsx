import { type Metadata } from "next"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"

import { getProducts } from "@/lib/queries/product"
import { AlertCard } from "@/components/alert-card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { ContentSection } from "@/components/content-section"
import { ProductCard } from "@/components/product-card"
import React from "react"
import { ProductContentSection } from "@/components/products-content-section"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Products",
  description: "Buy products from our stores",
}

interface ProductsPageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  
  const productsTransaction = await getProducts(searchParams)
  
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>

      <ProductContentSection
          title="Featured products"
          description="Explore products from around the world"
          href="/products"
          linkText="View all products"
          className="pt-1"
        >
          {productsTransaction.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductContentSection>
    </Shell>
  )
}
