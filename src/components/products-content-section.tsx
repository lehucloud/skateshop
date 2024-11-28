import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  href: string
  linkText?: string
  children: React.ReactNode
  asChild?: boolean
}

export function ProductContentSection({
  title,
  description,
  href,
  linkText = "View all",
  children,
  className,
  asChild = false,
  ...props
}: ContentSectionProps) {
  const ChildrenShell = asChild ? Slot : "div"

  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div className="space-y-8">
        <ChildrenShell
          className={cn(
            !asChild &&
              "grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {children}
        </ChildrenShell>
        
      </div>
    </section>
  )
}
