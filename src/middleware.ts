// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) {
//     const url = new URL(req.nextUrl.origin)

//     auth().protect({
//       unauthenticatedUrl: `${url.origin}/signin`,
//       unauthorizedUrl: `${url.origin}/dashboard/stores`,
//     })
//   }
// })

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// }
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = (path: string) => path.startsWith('/dashboard')

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const { pathname, origin } = nextUrl

  if (isProtectedRoute(pathname)) {
    const sessionToken = cookies.get('__Secure-authjs.session-token')  // 生产环境 HTTPS 使用此名称

    if (!sessionToken) {
      return NextResponse.redirect(`${origin}/signin`)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}