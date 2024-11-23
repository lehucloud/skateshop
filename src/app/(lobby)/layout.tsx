// import { getCachedUser } from "@/lib/queries/user"

import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
// import { useSession } from "next-auth/react"
import { auth } from "@/lib/auth"


interface LobyLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode
  }> {}

export default async function LobyLayout({ children, modal }: LobyLayoutProps) {
  const session = await auth()

  if(!session?.user){
    return (
      <>
      <SiteHeader user= {null} />
        <main className="flex-1">
          {children}
          {modal}
        </main>
      <SiteFooter />
      </>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1">
        {children}
        {modal}
      </main>
      <SiteFooter />
    </div>
  )
}
