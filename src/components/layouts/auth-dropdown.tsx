import * as React from "react"
import Link from "next/link"
// import type { User } from "@clerk/nextjs/server"
import type { User } from "next-auth"
import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons"

import { getStoreByUserId } from "@/lib/queries/store"
import { cn, getUserEmail } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { dashboardConfig } from "@/config/dashboard"

interface AuthDropdownProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger>,
    ButtonProps {
  user: User | null
}

export async function AuthDropdown({
  user,
  className,
  ...props
}: AuthDropdownProps) {
  if (!user) {
    return (
      <Button size="sm" className={cn(className)} {...props} asChild>
        <Link href="/signin">
          Sign In
          <span className="sr-only">Sign In</span>
        </Link>
      </Button>
    )
  }

  const initials = `${user.name?.charAt(0) ?? ""} ${
    user.name?.charAt(0) ?? ""
  }`
  // const email = getUserEmail(user)

  const storePromise = getStoreByUserId({ userId: user.id==null? "" : user.id })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("size-8 rounded-full", className)}
          {...props}
        >
          <Avatar className="size-8">
            <AvatarImage src={user.image==null?"":user.image} alt={user.name ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <React.Suspense
          fallback={
            <div className="flex flex-col space-y-1.5 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-sm" />
              ))}
            </div>
          }
        >
          <AuthDropdownGroup storePromise={storePromise} user= {user} />
        </React.Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signout">
            <ExitIcon className="mr-2 size-4" aria-hidden="true" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AuthDropdownGroupProps {
  storePromise: ReturnType<typeof getStoreByUserId>,
  user: User | null
}

async function AuthDropdownGroup({ storePromise,user }: AuthDropdownGroupProps) {
  const store = await storePromise

  const items = dashboardConfig.sidebarNav
  
  return (
    <DropdownMenuGroup>
      {store ? 
        <DropdownMenuItem asChild>
              <Link href={`/store/${store.id}`}>
                <Icons.store className="mr-2 size-4" aria-hidden="true" />
                My store 
                {/* <DropdownMenuShortcut>⌘D</DropdownMenuShortcut> */}
              </Link>
        </DropdownMenuItem>
      :
        <DropdownMenuItem asChild>
              <Link href={`/onboarding`}>
                <Icons.store className="mr-2 size-4" aria-hidden="true" />
                Create store
                {/* <DropdownMenuShortcut>⌘D</DropdownMenuShortcut> */}
              </Link>
        </DropdownMenuItem>
      }
      {items.map((item) => {
        const IconComponent = item.icon ? Icons[item.icon] : null;
        return (
          <DropdownMenuItem asChild>
            <Link href={`${item.href}`}>
              {IconComponent && (
                <IconComponent className="mr-2 size-4" aria-hidden="true" />
              )}
              {item.title}
              {/* <DropdownMenuShortcut>⌘D</DropdownMenuShortcut> */}
            </Link>
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuGroup>
  )
}
