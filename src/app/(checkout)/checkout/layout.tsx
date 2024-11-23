import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

// import { getCachedUser } from "@/lib/queries/user"

export default async function CheckoutLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return <main>{children}</main>
}
