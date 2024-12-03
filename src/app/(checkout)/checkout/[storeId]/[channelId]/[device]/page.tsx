import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { NewOrder, Order, Payment, payments, stores } from "@/db/schema"
import { env } from "@/env.js"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { and, eq } from "drizzle-orm"

import { deleteCart, getCart } from "@/lib/actions/cart"
import PaymentFactory from "@/lib/actions/payments"
import { cn, formatPrice } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutShell } from "@/components/checkout/checkout-shell"
import { Shell } from "@/components/shell"
import getPayChannelsByStoreId from "@/lib/queries/store"
import { P } from "node_modules/@upstash/redis/zmscore-Dc6Llqgr.mjs"
import { PaymentClient, PayOrder } from "@/lib/types"
import { generateId } from "@/lib/id"
import { AlipayCheckoutShell } from "@/components/checkout/checkout-shell-alipay"
import { WxpayCheckoutShell } from "@/components/checkout/checkout-shell-wxpay"
import { addOrder } from "@/lib/actions/order"
import { checkoutItemSchema } from "@/lib/validations/cart"
import { Check } from "lucide-react"
import { CreateOrderSchema } from "@/lib/validations/order"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
}

interface CheckoutPageProps {
  params: {
    storeId: string
    channelId: string
    device: string
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const storeId = decodeURIComponent(params.storeId)
  const channelId = decodeURIComponent(params.channelId)
  const device: PaymentClient = decodeURIComponent(params.device) as PaymentClient

  
  const store = await db
    .select({
      id: stores.id,
      name: stores.name,
      userId: stores.userId,
      stripeAccountId: stores.stripeAccountId,
    })
    .from(stores)
    .where(eq(stores.id, storeId))
    .execute()
    .then((rows) => rows[0])

  if (!store) {
    notFound()
  }

  const payChannel = await db.query.payments.findFirst({
    where: and(
      eq(payments.storeId, storeId),
      eq(payments.id, channelId)
    ),
  });

  const cartLineItems = await getCart({ storeId })
  //获取支付渠道，提交配置信息到微信，创建支付订单，拿到支付订单返回的支付链接 传入到微信支付组件中自动提交支付 唤起微信支付或者支付宝支付
  //组装支付订单信息并提交第三方支付平台
  const payemnt = PaymentFactory(payChannel as Payment);

  const total = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.price),
    0
  )
  const quantity = cartLineItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  )

  const payorder: PayOrder = {
    orderId: generateId(),
    amount: total.toString(),
    description: "test",
  }

  const paymentPromise = payemnt.pay(payorder,device)

  
  const newOrder: CreateOrderSchema = {
      storeId: storeId,
      items:  cartLineItems.map((item) => {
        return {
          productId: item.id,
          options: item.options,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }}),
      quantity: Number(quantity),
      amount: total.toFixed(2),
      storeOrderNo: payorder.orderId,
      payClient: device,
      status: "pending",
      userId: store.userId,
  }

  addOrder(newOrder);

  

  if (!payChannel) {
    return (
      <Shell variant="centered">
        <div className="flex flex-col items-center justify-center gap-2 pt-20">
          <div className="text-center text-2xl font-bold">
            Store is not connected to Stripe
          </div>
          <div className="text-center text-muted-foreground">
            Store owner needs to connect their store to Stripe to accept
            payments
          </div>
          <Link
            aria-label="Back to cart"
            href="/cart"
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            Back to cart
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <section className="relative flex h-full min-h-dvh flex-col items-start justify-center lg:h-dvh lg:flex-row lg:overflow-hidden">
      <div className="w-full space-y-12 pt-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-[#09090b] py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center justify-between space-x-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2 lg:flex-auto"
            >
              <ArrowLeftIcon
                className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                Skateshop
              </div>
              <div className="hidden font-medium transition group-hover:block">
                Back
              </div>
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto flex h-[82%] w-full max-w-4xl flex-col space-y-6 border pb-6 pt-8">
                <CartLineItems
                  items={cartLineItems}
                  variant="minimal"
                  isEditable={false}
                  className="container h-full flex-1 pr-8"
                />
                <div className="container space-y-4 pr-8">
                  <Separator />
                  <div className="flex font-medium">
                    <div className="flex-1">
                      Total (
                      {quantity}
                      )
                    </div>
                    <div>{formatPrice(total)}</div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="container flex max-w-xl flex-col items-center space-y-1 lg:ml-auto lg:mr-0 lg:items-start lg:pr-[4.5rem]">
          <div className="line-clamp-1 font-semibold text-muted-foreground">
            Pay to {store.name}
          </div>
          <div className="text-3xl font-bold">{formatPrice(total)}</div>
        </div>
        <CartLineItems
          items={cartLineItems}
          isEditable={false}
          className="container hidden w-full max-w-xl lg:ml-auto lg:mr-0 lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
        <div className="container flex max-w-xl flex-col items-center space-y-6 lg:ml-auto lg:mr-0 lg:items-start lg:pr-[4.5rem]">
        
        {payChannel.channel==='wxpay' ? (
          <WxpayCheckoutShell
            storeId={storeId}
            device={device}
            paymentPromise={paymentPromise}
            className="w-full max-w-xl"/>
        ):(
          <AlipayCheckoutShell
            storeId={storeId}
            device={device}
            paymentPromise={paymentPromise}
            className="w-full max-w-xl"/>
        )}
      </div>
      </div>
    </section>
  )
}
