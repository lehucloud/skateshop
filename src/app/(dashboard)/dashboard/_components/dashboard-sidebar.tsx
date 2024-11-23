"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import { type SidebarNavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import { SidebarNav } from "@/components/layouts/sidebar-nav"

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLElement> {
  storeId: string
  children: React.ReactNode
}

export function DashboardSidebar({
  storeId,
  children,
  className,
  ...props
}: DashboardSidebarProps) {
  const segments = useSelectedLayoutSegments()

  const sidebarNav: SidebarNavItem[] = [
    {
      title: "Dashboard",
      href: `/dashboard`,
      icon: "dashboard",
      active: segments.length === 0,
    },
    {
      title: "Billing",
      href: `/dashboard/billing`,
      icon: "product",
      active: segments.includes("billing"),
    },
    // {
    //   title: "Purchases",
    //   href: `/dashboard/purchases`,
    //   icon: "product",
    //   active: segments.includes("purchases"),
    // },
    // {
    //   title: "Account",
    //   href: `/dashboard/account`,
    //   icon: "avatar",
    //   active: segments.includes("account"),
    // },
    {
      title: "Settings",
      href: `/dashboard/settings`,
      icon: "settings",
      active: segments.includes("settings"),
    },
  ]

  return (
    <aside className={cn("h-screen w-full", className)} {...props}>
      <div className="hidden h-[3.55rem] items-center border-b border-border/60 px-4 lg:flex lg:px-6">
        <Link
          href="/"
          className="flex w-fit items-center font-heading tracking-wider text-foreground/90 transition-colors hover:text-foreground"
        >
          <Icons.logo className="mb-1 mr-2 size-7" aria-hidden="true" />
          {siteConfig.name}
        </Link>
      </div>
      <div className="flex flex-col gap-2.5 px-4 pt-2 lg:px-6 lg:pt-4">
        {children}
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)] px-3 py-2.5 lg:px-5">
        <SidebarNav items={sidebarNav} className="p-1 pt-4" />
      </ScrollArea>
    </aside>
  )
}
