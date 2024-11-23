"use client"

import * as React from "react"
import { PaymentClient } from "@/lib/types"

/**
 * See the Stripe documentation for more information:
 * @see https://stripe.com/docs/payments/quickstart
 */

interface CheckoutShellProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  storeId: string
  device: PaymentClient
  paymentPromise: Promise<{
    data: any | null
    error: string | null
  }>
}

export function AlipayCheckoutShell({
  storeId,
  device,
  paymentPromise,
  className,
  ...props
}: CheckoutShellProps) {

  const { data, error } = React.use(paymentPromise)

  React.useEffect(() => {
    if(device === 'pc'){
      window.location.href = data
    }else{
      window.location.href = data
    }
  }, [data])

  return (
    <div className={className} {...props}>
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent" />
        <span className="ml-2">正在跳转到支付页面...</span>
      </div>
    </div>
  )
};
