import Link from "next/link"

import { siteConfig } from "@/config/site"
import { type getGithubStars } from "@/lib/queries/github"
import type { getCategories, getFeaturedProducts } from "@/lib/queries/product"
import { type getFeaturedStores } from "@/lib/queries/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ContentSection } from "@/components/content-section"
import { Icons } from "@/components/icons"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ProductCard } from "@/components/product-card"
import { Shell } from "@/components/shell"
import { StoreCard } from "@/components/store-card"

import { CategoryCard } from "./category-card"
import { ProductContentSection } from "@/components/products-content-section"
import HeroHome from "./hero-home"

interface LobbyProps {
  githubStarsPromise: ReturnType<typeof getGithubStars>
  productsPromise: ReturnType<typeof getFeaturedProducts>
  categoriesPromise: ReturnType<typeof getCategories>
  storesPromise: ReturnType<typeof getFeaturedStores>
}

export async function Lobby({
  githubStarsPromise,
  productsPromise,
  categoriesPromise,
  storesPromise,
}: LobbyProps) {
  // @see the "Parallel data fetching" docs: https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
  const [githubStars, products, categories, stores] = await Promise.all([
    githubStarsPromise,
    productsPromise,
    categoriesPromise,
    storesPromise,
  ])

  return (
    <Shell className="max-w-6xl gap-0">
      <PageHeader
        as="section"
        className="mt-12 text-center lg:mt-1 gap-2 "
        withPadding
      >
        <div className="flex flex-col items-center justify-center lg:items-end lg:justify-end lg:flex-row-reverse lg:flex-row">

          <HeroHome className="flex border-0 lg:w-2/5 2xl:w-1/3 "/>

          <div className="flex flex-col lg:w-3/5   2xl:w-2/3 mt-4">
          <PageHeaderHeading
            className="animate-fade-up lg:text-left"
            style={{ animationDelay: "0.20s", animationFillMode: "both",  }}
          >
            <span className="lg:text-6xl lg:leading-[1.8] my-4 bg-clip-text text-transparent bg-gradient-to-r 
            from-[var(--c-yellow-2)] to-[var(--c-green-1)] md:to-[var(--c-yellow-2)] md:from-[var(--c-green-1)]">
            UnionShop
            </span>
            <p className="lg:text-5xl xl:text-6xl ">共享VIP一站式解决方案</p>
          </PageHeaderHeading>
          <PageHeaderDescription
            className="max-w-[46.875rem] animate-fade-up lg:text-left mt-2"
            style={{ animationDelay: "0.30s", animationFillMode: "both" }}
          >
            <i className="lg:text-2xl ">引领您进入五彩斑斓的视听世界，并涵盖了 Netflix 、Disney+ 、Spotify会员 和 YouTube会员 的精彩领域</i>
          </PageHeaderDescription>
          <PageActions
            className="animate-fade-up  lg:items-start lg:justify-start "
            style={{ animationDelay: "0.40s", animationFillMode: "both" }}
          >
            <Link href="/products" className={cn(buttonVariants()," hover:scale-105 transition-transform duration-200 ease-in-out")}>
              立即购买
            </Link>
            <Link
              href="/dashboard/stores"
              className={cn(buttonVariants({ variant: "outline" }),"hover:scale-105 transition-transform duration-200 ease-in-out")}
            >
              我要开店
            </Link>
          </PageActions>
          </div>
        </div>
      </PageHeader>
      
      <ProductContentSection
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="lg:pt-8"
      >
        {products.map((product) => (
          <ProductCard className=" " key={product.id} product={product} />
        ))}
      </ProductContentSection>
      <ContentSection
        title="Featured stores"
        description="Explore stores from around the world"
        href="/stores"
        linkText="View all stores"
        className="py-14 lg:py-20 lg:py-24"
      >
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            href={`/products?store_ids=${store.id}`}
          />
        ))}
      </ContentSection>

      <section
        className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4"
        style={{ animationDelay: "0.50s", animationFillMode: "both" }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </section>
    </Shell>
  )
}
