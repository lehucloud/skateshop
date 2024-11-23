import * as React from "react"
import { type Metadata } from "next"
import { redirect } from "next/navigation"
// import { auth } from "@clerk/nextjs/server"

import { Skeleton } from "@/components/ui/skeleton"
import { GridPattern } from "@/components/grid-pattern"
import { Shell } from "@/components/shell"

import { Onboarding } from "./_components/onboarding"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Get started with your new store",
}

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const user = session?.user

  return (
    <Shell className="h-[calc(100vh-4rem)] max-w-screen-sm">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className="[mask-image:radial-gradient(300px_circle_at_left_top,white,transparent)]"
      />
      <React.Suspense fallback={<Skeleton className="size-full" />}>
        <Onboarding userId={user.id as string} />
      </React.Suspense>
    </Shell>
  )
}
