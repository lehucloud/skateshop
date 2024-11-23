"use client"

import * as React from "react"
// import { useSignIn } from "@clerk/nextjs"
import { type OAuthStrategy } from "@clerk/types"

import { showErrorToast } from "@/lib/handle-error"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getSession, signIn } from "next-auth/react"
import { redirect } from "next/navigation"

const oauthProviders = [
  { name: "Google", id: "google", icon: "google" },
  { name: "Github", id: "github", icon: "gitHub" },
  { name: "WeChat", id: "wechat", icon: "credit" },
] satisfies {
  name: string
  icon: keyof typeof Icons,
  id: string
}[]

export function OAuthSignIn() {
  const [loading, setLoading] = React.useState<string | null>(null)
  const handleLogin = async (id:string) => {
    const response = await signIn(id);

    if(response){
      redirect("/dashboard")
    }
    setLoading(id)
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon]

        return (
          <Button
            key={provider.id}
            variant="outline"
            className="w-full bg-background"
            onClick={() => void handleLogin(provider.id)}
            disabled={loading !== null}
          >
            {loading === provider.id ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden="true" />
            )}
            {provider.name}
            <span className="sr-only">{provider.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
