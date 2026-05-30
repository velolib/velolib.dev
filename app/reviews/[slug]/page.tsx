import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { allReviews } from "content-collections"
import ReviewBadge from "@/components/reviews/review-badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDateRange } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import ReturnToTop from "@/components/shared/return-to-top"
import Toc from "@/components/shared/toc"
import { createReviewMdxComponents } from "@/components/mdx/mdx-components"
import { slimReview } from "@/lib/content"
import GradientBackground from "@/components/layout/gradient-background"
import {
  buildPageMetadata,
  buildReviewOgImageUrl,
  toAbsoluteUrl,
} from "@/lib/seo"

export async function generateStaticParams() {
  return allReviews.map((post) => ({
    slug: post.slug,
  }))
}

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const review = allReviews.find((entry) => entry.slug === slug)

  if (!review) {
    return {
      title: "Review not found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Build the review OG image URL and include the review slug so the OG route
  // can infer a backdrop image at `/images/reviews/{slug}/backdrop.jpg`.
  const image = buildReviewOgImageUrl({
    title: review.title,
    description: review.shortReview,
    eyebrow: `Reviews | ${formatDateRange(review.startDate, review.finishDate)}`,
    rating: review.overallRating,
    quality: review.quality,
    enjoyment: review.enjoyment,
    impact: review.impact,
    status: review.status,
    medium: review.medium,
    format: review.formats[0],
    genres: review.genres,
    slug: review.slug,
  })

  return buildPageMetadata({
    title: review.title,
    description: review.shortReview,
    pathname: `/reviews/${review.slug}`,
    type: "article",
    publishedTime: review.finishDate.toISOString(),
    modifiedTime: review.finishDate.toISOString(),
    keywords: [
      "review",
      "media review",
      review.medium,
      ...review.genres,
      review.slug,
    ],
    image,
    robots: review.draft
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const review = allReviews.find((post) => post.slug === slug)
  if (!review) {
    notFound()
  }

  const MdxContent = review.mdxContent

  const reviewLookup = Object.fromEntries(
    allReviews.map((entry) => {
      const entrySlug = entry.slug

      return [entrySlug, slimReview(entry)]
    })
  )

  const reviewMdxComponents = createReviewMdxComponents(reviewLookup)
  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: review.shortReview,
    datePublished: review.finishDate.toISOString(),
    author: {
      "@type": "Person",
      name: "Malik",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.overallRating,
      bestRating: 10,
      worstRating: 0,
    },
    itemReviewed: {
      "@type": "CreativeWork",
      name: review.title,
      genre: review.genres,
      image: [toAbsoluteUrl(review.poster), toAbsoluteUrl(review.backdrop)],
      datePublished: review.finishDate.toISOString(),
    },
    url: toAbsoluteUrl(`/reviews/${review.slug}`),
  }

  return (
    <main
      className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth"
      id="scroll-root"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />
      <div className="relative flex flex-col">
        <GradientBackground />
        <article className="container mx-auto flex flex-col gap-10 p-4 pb-10 sm:p-6 md:pb-14 lg:p-8">
          <div className="space-y-5">
            <Link
              href="/reviews"
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to reviews
            </Link>
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.32em] text-muted-foreground uppercase">
                Reviews | {formatDateRange(review.startDate, review.finishDate)}
              </p>
              <h1 className="text-brand pb-2 font-serif text-5xl font-bold tracking-tight md:text-6xl">
                {review.title}
              </h1>
              {review.aka && review.aka.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  AKA: {review.aka.join(", ")}
                </p>
              )}
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {review.shortReview}
              </p>
            </div>

            <div className="grid gap-4 md:flex md:h-[clamp(18rem,42vw,34rem)] md:items-stretch md:gap-6">
              <div className="overflow-hidden rounded-3xl border bg-muted md:aspect-[0.68] md:h-full md:w-auto md:flex-none">
                <Image
                  src={review.poster}
                  alt={`Poster for ${review.title}`}
                  width="680"
                  height="1000"
                  className="block h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-3xl border bg-muted md:h-full md:min-w-0 md:flex-1">
                <Image
                  src={review.backdrop}
                  alt={`Backdrop for ${review.title}`}
                  width="1920"
                  height="1080"
                  className="block h-full w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                  Review
                </p>
                <div className="flex flex-wrap gap-2">
                  <ReviewBadge type="rating" value={review.overallRating} />
                  <ReviewBadge type="quality" value={review.quality} />
                  <ReviewBadge type="enjoyment" value={review.enjoyment} />
                  <ReviewBadge type="impact" value={review.impact} />
                  <ReviewBadge type="status" value={review.status} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {review.medium && (
                    <ReviewBadge type="medium" value={review.medium} />
                  )}
                  {(review.formats ?? []).map((format) => (
                    <ReviewBadge key={format} type="format" value={format} />
                  ))}
                  {(review.genres ?? []).map((genre) => (
                    <ReviewBadge key={genre} type="genre" value={genre} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {review.toc && review.toc.length > 0 && <Toc toc={review.toc} />}
          <article className="prose max-w-none pt-6 text-pretty prose-neutral dark:prose-invert prose-headings:tracking-tight prose-a:text-sky-300">
            <MdxContent components={reviewMdxComponents} />
          </article>
        </article>
      </div>
      <ReturnToTop />
    </main>
  )
}
