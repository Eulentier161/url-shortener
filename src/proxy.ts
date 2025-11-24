import { eq } from "drizzle-orm"
import { NextResponse, type NextRequest } from "next/server"
import { db } from "./db"
import { redirectsTable } from "./db/schema"

export async function proxy(request: NextRequest) {
  const dest = request.nextUrl.pathname.split("/")[1]
  const res = await db.query.redirectsTable.findFirst({
    where: eq(redirectsTable.slug, dest),
  })

  return res
    ? NextResponse.redirect(res.url, 301)
    : NextResponse.redirect(new URL("/", request.url), 302)
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, .png, .ico, .svg files, and the app root
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.ico$|.*\\.svg$|$).*)",
  ],
}
