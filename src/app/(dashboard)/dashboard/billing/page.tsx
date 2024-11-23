import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.js"
import { RocketIcon } from "@radix-ui/react-icons"

import {  getPlan,getPlans } from "./_components/demo"
import { getUserUsageMetrics } from "@/lib/queries/user"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

import { Billing } from "./_components/billing"
import { BillingSkeleton } from "./_components/billing-skeleton"
import { auth } from "@/lib/auth"
import { aw } from "node_modules/@upstash/redis/zmscore-80635339"
import { Plan, PlanWithPrice, UserPlan } from "@/types"
// import { auth } from "@clerk/nextjs/server"
// import { useSession } from "next-auth/react"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Billing",
  description: "Manage your billing and subscription plan",
}


export default  async function BillingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const user = session.user

  const planPromise = getPlan()
  const plansPromise = getPlans()
  const usageMetricsPromise = getUserUsageMetrics({ userId: user.id as string})

  // 

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Billing</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your billing and subscription plan
        </PageHeaderDescription>
      </PageHeader>
      <Alert>
        <RocketIcon className="size-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Skateshop is a demo app using a Stripe test environment. You can find
          a list of test card numbers on the{" "}
          <a
            href="https://stripe.com/docs/testing"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 transition-colors hover:text-foreground/80"
          >
            Stripe docs
          </a>
          .
        </AlertDescription>
      </Alert>
      <React.Suspense fallback={<BillingSkeleton />}>
        <Billing
          planPromise={planPromise}
          plansPromise={plansPromise}
          usageMetricsPromise={usageMetricsPromise}
        />
      </React.Suspense>
    </Shell>
  )
}
