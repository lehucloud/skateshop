import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.js"
import { eq } from "drizzle-orm"

import { updateStore } from "@/lib/actions/store"
// import { getStripeAccount } from "@/lib/actions/stripe"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ConnectStoreToStripeButton } from "@/components/connect-store-to-stripe-button"
import { LoadingButton } from "@/components/loading-button"

interface DashboardStorePageProps {
  params: {
    storeId: string
  }
}

async function getStoreFromParams(params: DashboardStorePageProps["params"]) {
  const { storeId } = params

  const store = await db.query.stores.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
    },
    where: eq(stores.id, storeId),
  })

  if (!store) return null

  return store
}

export async function generateMetadata({
  params,
}: DashboardStorePageProps): Promise<Metadata> {
  const store = await getStoreFromParams(params)

  if (!store) {
    return {}
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: `Manage ${store.name} store`,
    description:
      store.description ?? "Manage inventory, orders, and more in your store.",
  }
}

export default async function DashboardStorePage({
  params,
}: DashboardStorePageProps) {
  const store = await getStoreFromParams(params)

  if (!store) {
    notFound()
  }

  // const { account: stripeAccount } = await getStripeAccount({
  //   storeId: store.id,
  // })

  const accounts = [
    {
      id: "wxpay",
      name:"Wxpay",
      mrt_no: "798279247829922",
      icon: "wechat",
      mrt_sub_id: 0,
    },
    {
      id: "alipay",
      name:"Alipay",
      mrt_no: "798279247829922018210",
      icon: "alipay",
      mrt_sub_id: 0,
    },
  ]

  return (
    <div className="space-y-10">
      {accounts ? (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="line-clamp-1 text-2xl">
              Manage Wallets account
            </CardTitle>
            <CardDescription>
              Manage your Wallets account and view your payouts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {accounts.map((account) => (
              <Card>
                <CardContent>
                  <CardTitle className="text-xl space-y-1">{account.name}</CardTitle>
                  <CardContent className="grid gap-1">
                    <div className="flex justify-between">
                      <span>MrtNo</span>
                      <span>{account.mrt_no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MrtSubId</span>
                      <span>{account.mrt_sub_id}</span>
                    </div>
                  </CardContent>
                </CardContent>
              </Card>
            ))}
          </CardContent>
          <CardFooter>
            <Link
              aria-label="Manage Wallets account"
              href={`/store/${store.id}/payments`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  className: "text-center",
                })
              )}
            >
              Manage Wallets account
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="line-clamp-1 text-2xl">
              Connect to Wxpay or Alipay
            </CardTitle>
            <CardDescription>
              Connect your store to Wxpay or Alipay to start accepting payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectStoreToStripeButton storeId={store.id} />
          </CardContent>
        </Card>
      )}
      <Card as="section">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Update your store</CardTitle>
          <CardDescription>
            Update your store name and description, or delete it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={updateStore.bind(null, store.id)}
            className="grid w-full max-w-xl gap-5"
          >
            <div className="grid gap-2.5">
              <Label htmlFor="update-store-name">Name</Label>
              <Input
                id="update-store-name"
                aria-describedby="update-store-name-description"
                name="name"
                required
                minLength={3}
                maxLength={50}
                placeholder="Type store name here."
                defaultValue={store.name}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="update-store-description">Description</Label>
              <Textarea
                id="update-store-description"
                aria-describedby="update-store-description-description"
                name="description"
                minLength={3}
                maxLength={255}
                placeholder="Type store description here."
                defaultValue={store.description ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2 xs:flex-row">
              <LoadingButton action="update">
                Update store
                <span className="sr-only">Update store</span>
              </LoadingButton>
              {/* <LoadingButton
                formAction={deleteStore.bind(null, store.id)}
                variant="destructive"
                action="delete"
              >
                Delete store
                <span className="sr-only">Delete store</span>
              </LoadingButton> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
