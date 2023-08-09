import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import dayjs from "dayjs"
import { desc, eq, sql } from "drizzle-orm"

import { getRandomPatternStyle } from "@/lib/generate-pattern"
import {
  getFeaturedStoreAndProductCounts,
  getUserSubscriptionPlan,
} from "@/lib/subscription"
import { cn, formatDate } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { StoreCard } from "@/components/store-card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const storesWithProductCount = await db
    .select({
      id: stores.id,
      name: stores.name,
      description: stores.description,
      productCount: sql<number>`count(*)`,
    })
    .from(stores)

    .leftJoin(products, eq(products.storeId, stores.id))
    .groupBy(stores.id)
    .orderBy(desc(sql<number>`count(*)`))
    .where(eq(stores.userId, user.id))

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  const isSubscriptionPlanActive = dayjs(
    subscriptionPlan.stripeCurrentPeriodEnd
  ).isAfter(dayjs())

  const { featuredStoreCount, featuredProductCount } =
    getFeaturedStoreAndProductCounts(subscriptionPlan.id)

  return (
    <Shell variant="sidebar">
      <PageHeader title="Stores" description="Manage your stores" size="sm" />
      <Alert>
        <Icons.terminal className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are currently on the{" "}
          <span className="font-semibold">{subscriptionPlan.name}</span> plan.{" "}
          {!subscriptionPlan.isSubscribed
            ? "Upgrade to create more stores and products."
            : subscriptionPlan.isCanceled
            ? "Your plan will be canceled on "
            : "Your plan renews on "}
          {subscriptionPlan?.stripeCurrentPeriodEnd
            ? `${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.`
            : null}{" "}
          You can create up to{" "}
          <span className="font-semibold">{featuredStoreCount}</span> stores and{" "}
          <span className="font-semibold">{featuredProductCount}</span> products
          on this plan.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {storesWithProductCount.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
        {storesWithProductCount.length < 3 && (
          <Card className="flex h-full flex-col">
            <AspectRatio ratio={21 / 9}>
              <div
                className="h-full rounded-t-md"
                style={getRandomPatternStyle(crypto.randomUUID())}
              />
            </AspectRatio>
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">Create a new store</CardTitle>
              <CardDescription className="line-clamp-2">
                Create a new store to start selling your products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={
                  subscriptionPlan.id === "basic" &&
                  storesWithProductCount.length >= 1
                    ? "/dashboard/billing"
                    : subscriptionPlan.id === "standard" &&
                      isSubscriptionPlanActive &&
                      storesWithProductCount.length >= 2
                    ? "/dashboard/billing"
                    : subscriptionPlan.id === "pro" &&
                      isSubscriptionPlanActive &&
                      storesWithProductCount.length >= 3
                    ? "/dashboard/billing"
                    : "/dashboard/stores/new"
                }
              >
                <div
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "h-8 w-full",
                    })
                  )}
                >
                  Create a store
                  <span className="sr-only">Create a new store</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Shell>
  )
}
