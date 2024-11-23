"use client"

import * as React from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { DialogTitle } from "@radix-ui/react-dialog"
import {
  CaretSortIcon,
  CheckIcon,
  FrameIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { type getStoresByUserId } from "@/lib/queries/store"
import { type getUserPlanMetrics } from "@/lib/queries/user"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RateLimitAlert } from "@/components/rate-limit-alert"


interface StoreSwitcherProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  userId: string
  storesPromise: ReturnType<typeof getStoresByUserId>
  planMetricsPromise: ReturnType<typeof getUserPlanMetrics>
}

export function StoreSwitcher({
  userId,
  storesPromise,
  planMetricsPromise,
  className,
  ...props
}: StoreSwitcherProps) {
  const { storeId } = useParams<{ storeId: string }>()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [showNewStoreDialog, setShowNewStoreDialog] = React.useState(false)
  const [showRateLimitDialog, setShowRateLimitDialog] = React.useState(false)

  const stores = React.use(storesPromise)
  const planMetrics = React.use(planMetricsPromise)
  const rateLimitExceeded =
    planMetrics.storeLimitExceeded || planMetrics.productLimitExceeded

  const selectedStore = stores.find((store) => store.id === storeId)

  return (
    <>
      {/*  不用处理店铺 */}
    </>
  )
}
