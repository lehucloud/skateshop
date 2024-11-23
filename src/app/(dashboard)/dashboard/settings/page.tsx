import * as React from "react"
import type { Metadata } from "next"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { z } from "zod"

import { getNotification } from "@/lib/queries/notification"
// import { getCachedUser } from "@/lib/queries/user"
import { getUserEmail } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

import { UpdateNotificationForm } from "./_components/update-notification-form"
import { UpdateNotificationFormSkeleton } from "./_components/update-notification-form-skeleton"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import UserProfile from "../account/[[...rest]]/_components/user-profile"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Settings",
  description: "Manage your settings",
}

interface SettingsPageProps {
  searchParams: SearchParams
}

const schema = z.object({
  token: z.string().optional(),
})

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const { token } = schema.parse(searchParams)

  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const user = session.user

  const notificationPromise = getNotification({
    token,
    email: getUserEmail(user) as string,
  })

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Settings</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your settings
        </PageHeaderDescription>
      </PageHeader>
      <UserProfile />
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <React.Suspense fallback={<UpdateNotificationFormSkeleton />}>
            <UpdateNotificationForm notificationPromise={notificationPromise} />
          </React.Suspense>
        </CardContent>
      </Card>
    </Shell>
  )
}
