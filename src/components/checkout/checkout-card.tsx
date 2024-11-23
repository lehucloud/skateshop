import Link from "next/link"

import { getCart } from "@/lib/actions/cart"
import { cn, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import getPayChannelsByStoreId from "@/lib/queries/store"
import PaymentLinks from "./checkout-payment-button"

interface CheckoutCardProps {
  storeId: string
}

export async function CheckoutCard({ storeId }: CheckoutCardProps) {
  const cartLineItems = await getCart({ storeId })

  //获取当前商户的支付钱包账户信息
  const payChannels = await getPayChannelsByStoreId({
    storeId,
  })
  

  return (
    <Card
      key={storeId}
      as="section"
      id={`checkout-store-${storeId}`}
      aria-labelledby={`checkout-store-${storeId}-heading`}
      className={cn(
        cartLineItems[0]?.storeStripeAccountId
          ? "border-green-500"
          : "border-destructive"
      )}
    >
      <CardHeader className="flex flex-row items-center space-x-4 py-4">
        <CardTitle className="line-clamp-1 flex-1">
          {cartLineItems[0]?.storeName}
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="pb-6 pl-6 pr-0">
        <CartLineItems items={cartLineItems} className="max-h-[280px]" />
      </CardContent>
      <Separator className="mb-4" />
      <CardFooter className="space-x-4">
        <span className="flex-1">
          Total ({cartLineItems.reduce((acc, item) => acc + item.quantity, 0)})
        </span>
        <span>
          {formatPrice(
            cartLineItems.reduce(
              (acc, item) => acc + Number(item.price) * item.quantity,
              0
            )
          )}
        </span>
        
        {payChannels.map((channel) => (
          <PaymentLinks storeId={storeId} payChannel={channel} key={channel.id} />
        ))}
      </CardFooter>
    </Card>
  )
}
