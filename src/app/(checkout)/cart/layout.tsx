import * as React from "react"
import { redirect } from "next/navigation"

// import { getCachedUser } from "@/lib/queries/user"
import { SiteHeader } from "@/components/layouts/site-header"
import { auth } from "@/lib/auth"

export default async function CartLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
