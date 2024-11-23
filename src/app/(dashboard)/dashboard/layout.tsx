'use'
import { redirect } from "next/navigation"

import { getStoresByUserId } from "@/lib/queries/store"
import { getUserPlanMetrics } from "@/lib/queries/user"

import { SidebarProvider } from "../../../components/layouts/sidebar-provider"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import { DashboardSidebarSheet } from "./_components/dashboard-sidebar-sheet"
import { StoreSwitcher } from "./_components/store-switcher"
import { auth } from "@/lib/auth"
// import { auth } from "@clerk/nextjs/server"

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const user = session.user

  const storesPromise = getStoresByUserId({ userId: user.id as string})
  const planMetricsPromise = getUserPlanMetrics({ userId: user.id  as string})

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[17.5rem_1fr]">
        <DashboardSidebar
          storeId="storeId"
          className="top-0 z-30 hidden flex-col gap-4 border-r border-border/60 lg:sticky lg:block"
        >
          <StoreSwitcher
            userId={user.id as string}
            storesPromise={storesPromise}
            planMetricsPromise={planMetricsPromise}
          />
        </DashboardSidebar>
        <div className="flex flex-col">
          <DashboardHeader user={user} storeId="storeId">
            <DashboardSidebarSheet className="lg:hidden">
              <DashboardSidebar storeId="storeId">
                <StoreSwitcher
                  userId={user.id as string}
                  storesPromise={storesPromise}
                  planMetricsPromise={planMetricsPromise}
                />
              </DashboardSidebar>
            </DashboardSidebarSheet>
          </DashboardHeader>
          <main className="flex-1 overflow-hidden px-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
