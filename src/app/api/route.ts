import { db } from "@/db"
import { redirectsTable } from "@/db/schema"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export function GET(req: Request) {
  return NextResponse.redirect(new URL("/", req.url), 302)
}

const RequestSchema = z.object({
  slug: z
    .string({ error: "Invalid Slug" })
    .refine((slug) => !slug.includes("/"), { error: "Slug cannot contain '/'" })
    .refine((slug) => !slug.includes("."), { error: "Slug cannot contain '.'" })
    .regex(/^(?!api$).*$/, { error: "Slug cannot be 'api'" })
    .regex(/^(?!_next$).*$/, { error: "Slug cannot be '_next'" })
    .transform(encodeURIComponent),
  url: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    normalize: true,
  }),
})

export type CreateRedirectSuccess = {
  type: "success"
  url: string
  slug: string
  errors?: never[]
  properties?: {
    slug?: { errors?: never[] }
    url?: { errors?: never[] }
  }
}
export type CreateRedirectError = {
  type: "error"
  url?: never
  slug?: never
  errors: string[]
  properties: {
    slug?: { errors: string[] }
    url?: { errors: string[] }
  }
}
export type CreateRedirectResponse = CreateRedirectSuccess | CreateRedirectError

function getPublicOrigin(req: Request): string {
  // Prefer explicit env override
  const envBase = process.env.PUBLIC_BASE_URL?.trim()
  if (envBase) {
    try {
      // Validate it's a proper URL with protocol
      const u = new URL(envBase)
      return u.origin
    } catch {
      // Fall through to header-based detection
    }
  }

  // Use forwarded headers (common in reverse proxies / containers)
  const headers = req.headers
  const proto = headers.get("x-forwarded-proto") || headers.get("x-forwarded-protocol") || "http"
  const host = headers.get("x-forwarded-host") || headers.get("host") || "localhost:3000"

  // If multiple hosts are forwarded (comma separated), take the first
  const firstHost = host.split(",")[0].trim()

  return `${proto}://${firstHost}`
}

export async function POST(req: NextRequest) {
  console.log("Received POST request to /api")
  const reqJson = await req.json()
  console.log("Request JSON:", reqJson)
  const parsed = RequestSchema.safeParse(reqJson)

  console.log(parsed)

  if (!parsed.success) {
    const error = z.treeifyError(parsed.error)
    return NextResponse.json({ type: "error", ...error }, { status: 400 })
  }

  let slug
  try {
    slug = (
      await db
        .insert(redirectsTable)
        .values(parsed.data)
        .returning({ slug: redirectsTable.slug })
    )[0].slug
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        type: "error",
        errors: ["Database insertion failed"],
        properties: {
          slug: { errors: ["Slug is already taken"] },
        },
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      type: "success",
      url: `${getPublicOrigin(req)}/${slug}`,
      slug,
    },
    { status: 201 }
  )
}
