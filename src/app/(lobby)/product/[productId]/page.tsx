import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { categories, products, stores } from "@/db/schema"
import { env } from "@/env.js"
import { and, desc, eq, not } from "drizzle-orm"

import { formatPrice, toTitleCase } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { Rating } from "@/components/rating"
import { Shell } from "@/components/shell"
import { Badge } from "@/components/ui/badge"

import { AddToCartForm } from "./_components/add-to-cart-form"
import { UpdateProductRatingButton } from "./_components/update-product-rating-button"
import { Button } from "@/components/ui/button"
import { VariantSelector } from "./_components/variant-selector"
import { Icons } from "@/components/icons"
interface ProductPageProps {
  params: {
    productId: string
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productId = decodeURIComponent(params.productId)

  const product = await db.query.products.findFirst({
    columns: {
      name: true,
      description: true,
    },
    where: eq(products.id, productId),
  })

  if (!product) {
    return {}
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(product.name),
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = decodeURIComponent(params.productId)

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
      inventory: true,
      rating: true,
      storeId: true,
      salesVolume: true,
    },
    with: {
      tags: {
        columns: {
          tagId: true,
        },
        with: {
          tag: true,
        }
      },
      skus: {
        columns: {
          id: true,
          quantity: true,
          price: true,
          originalPrice: true,
          variantCode: true,
          skuCode: true,
        },
      },
      variants: {
        columns: {
          id: true,
        },
        with: {
          variant: {
            columns: {
              id: true,
              name: true,
            },
          },
          productVariantOptions: true
        }
      }
    },
    where: eq(products.id, productId),
  });

  


  if (!product) {
    notFound()
  }


  const store = await db.query.stores.findFirst({
    columns: {
      id: true,
      name: true,
    },
    where: eq(stores.id, product.storeId),
  })

  const otherProducts = store
    ? await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        images: products.images,
        category: categories.name,
        inventory: products.inventory,
        rating: products.rating,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .limit(4)
      .where(
        and(
          eq(products.storeId, product.storeId),
          not(eq(products.id, productId))
        )
      )
      .orderBy(desc(products.inventory))
    : []

  return (
    <Shell className="max-w-6xl pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images ?? []}
          options={{
            loop: true,
          }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            {/* {product.skus.length >= 1 ? (
              null
            ):(
              <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>  
            )} */}
            {store ? (
              <Link
                href={`/products?store_ids=${store.id}`}
                className="line-clamp-1 inline-block text-base text-muted-foreground hover:underline"
              >
                <Icons.store className="inline-block w-4 h-4 mr-1" />
                {store.name}
              </Link>
            ) : null}
          </div>
          <Separator className="my-1.5" />
          <p className="text-base text-muted-foreground">
              销量: {product.salesVolume}  
          </p>
          {product.tags && (
            <div className="flex items-center space-x-2">
              {product.tags.map((item) => (
                <Badge key={item.tag.name} variant="outline" className="capitalize">
                  {item.tag.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Rating rating={Math.round(product.rating / 5)} />
            <UpdateProductRatingButton
              productId={product.id}
              rating={product.rating}
            />
          </div>

          {product.skus && product.skus[0] ? (
            <VariantSelector productId={product.id} skus={product.skus} variants={product.variants} initialSku={product.skus[0]} />
          ):(
            <>
              <div>
                <p>Price: $ {formatPrice(product.price)}</p>
                <p>Stock: {product.inventory} available</p>
              </div>
              <AddToCartForm productId={product.id} sku={null}  showBuyNow={true} />
            </>
          )}
        

          <Separator className="mt-5" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="description"
          >
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>
      {store && otherProducts.length > 0 ? (
        <div className="space-y-6 overflow-hidden">
          <h2 className="line-clamp-1 flex-1 text-2xl font-bold">
            More products from {store.name}
          </h2>
          <ScrollArea orientation="horizontal" className="pb-3.5">
            <div className="flex gap-4 py-4 ">
              {otherProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px] "
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </Shell>
  )
}
