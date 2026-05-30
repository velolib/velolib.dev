import type { Metadata } from "next"

const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const ENV_VERCEL_URL = process.env.VERCEL_URL

function resolveSiteUrl(): URL {
  if (ENV_SITE_URL) {
    return new URL(ENV_SITE_URL)
  }

  if (ENV_VERCEL_URL) {
    return new URL(`https://${ENV_VERCEL_URL}`)
  }

  return new URL("http://localhost:3000")
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = "velolib.dev"
export const SITE_DESCRIPTION =
  "Personal site for writing, media reviews, and projects by Malik (velolib)."

export const DEFAULT_KEYWORDS = [
  "velolib",
  "blog",
  "reviews",
  "projects",
  "anime reviews",
  "web development",
]

export function toAbsoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  return new URL(normalized, SITE_URL).toString()
}

export type BuildOgImageUrlInput = {
  title: string
  description: string
  eyebrow?: string
}

export function buildOgImageUrl({
  title,
  description,
  eyebrow = "Page",
}: BuildOgImageUrlInput): string {
  const imageUrl = new URL("/api/og/base", SITE_URL)

  imageUrl.searchParams.set("title", title)
  imageUrl.searchParams.set("description", description)
  imageUrl.searchParams.set("eyebrow", eyebrow)

  return imageUrl.toString()
}

export type BuildReviewOgImageUrlInput = {
  title: string
  description: string
  rating: number
  slug?: string
  eyebrow?: string
  quality?: string
  enjoyment?: string
  impact?: string
  status?: string
  medium?: string
  format?: string
  genres?: string[]
}

export function buildReviewOgImageUrl({
  title,
  description,
  rating,
  slug,
  quality,
  enjoyment,
  impact,
  status,
  medium,
  format,
  genres = [],
  eyebrow,
}: BuildReviewOgImageUrlInput): string {
  const imageUrl = new URL("/api/og/reviews", SITE_URL)

  imageUrl.searchParams.set("title", title)
  imageUrl.searchParams.set("description", description)
  imageUrl.searchParams.set("rating", String(rating))
  if (quality) imageUrl.searchParams.set("quality", quality)
  if (enjoyment) imageUrl.searchParams.set("enjoyment", enjoyment)
  if (impact) imageUrl.searchParams.set("impact", impact)
  if (status) imageUrl.searchParams.set("status", status)
  if (medium) imageUrl.searchParams.set("medium", medium)
  if (format) imageUrl.searchParams.set("format", format)
  if (genres.length > 0) imageUrl.searchParams.set("genres", genres.join(","))

  if (eyebrow) imageUrl.searchParams.set("eyebrow", eyebrow)

  // Optional slug used by the OG route to infer backdrop image paths
  // e.g. /images/reviews/{slug}/backdrop.jpg
  if (slug) imageUrl.searchParams.set("slug", slug)

  return imageUrl.toString()
}

export type BuildPageMetadataInput = {
  title: string
  description: string
  pathname: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  robots?: Metadata["robots"]
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  keywords,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  robots,
}: BuildPageMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(pathname)
  const imageUrl = image ? toAbsoluteUrl(image) : undefined
  const imageAltText = imageAlt ?? title

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: {
      canonical: pathname,
    },
    robots,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: imageAltText,
              },
            ],
          }
        : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }

  return metadata
}
