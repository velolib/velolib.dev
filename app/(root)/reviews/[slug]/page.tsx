import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRight, CalendarDays, Star } from "lucide-react"

import { allReviews } from "content-collections"
import ReviewBadge from "@/components/reviews/review-badge"
import { ReviewCard } from "@/components/reviews/review-card"
import { formatDateRange } from "@/lib/utils"
import ReturnToTop from "@/components/shared/return-to-top"
import { BackLink } from "@/components/shared/back-link"
import { SectionHeading } from "@/components/shared/section-heading"
import { SectionShell } from "@/components/shared/section-shell"
import { ArticleBody } from "@/components/shared/article-body"
import { createReviewMdxComponents } from "@/components/mdx/mdx-components"
import { slimReview } from "@/lib/content"
import GradientBackground from "@/components/layout/gradient-background"
import {
  buildPageMetadata,
  buildReviewOgImageUrl,
  toAbsoluteUrl,
} from "@/lib/seo"
import { PageScroller } from "@/components/layout/page-scroller"

const RELATED_REVIEW_COUNT = 4
const SCORE_LABEL =
  "text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase"

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

  const image = buildReviewOgImageUrl({
    title: review.title,
    description: review.shortReview,
    eyebrow: review.medium ? `Review · ${review.medium}` : "Review",
    date: formatDateRange(review.startDate, review.finishDate),
    rating: review.overallRating,
    quality: review.quality,
    enjoyment: review.enjoyment,
    impact: review.impact,
    status: review.status,
    medium: review.medium,
    format: review.formats[0],
    genres: review.genres,
    slug: review.slug,
    poster: review.poster,
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
    robots: {
      index: true,
      follow: true,
    },
  })
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const review = allReviews.find((post) => post.slug === slug)
  if (!review) {
    notFound()
  }

  const MdxContent = review.mdxContent

  const reviewLookup = Object.fromEntries(
    allReviews.map((entry) => [entry.slug, slimReview(entry)])
  )
  const reviewMdxComponents = createReviewMdxComponents(reviewLookup)

  const relatedReviews = allReviews
    .filter((entry) => entry.slug !== review.slug)
    .sort((a, b) => {
      const mediumDiff =
        Number(b.medium === review.medium) - Number(a.medium === review.medium)
      if (mediumDiff !== 0) return mediumDiff
      const target = review.finishDate.getTime()
      return (
        Math.abs(a.finishDate.getTime() - target) -
        Math.abs(b.finishDate.getTime() - target)
      )
    })
    .slice(0, RELATED_REVIEW_COUNT)
    .map(slimReview)

  const scores = [
    { label: "Quality", type: "quality", value: review.quality },
    { label: "Enjoyment", type: "enjoyment", value: review.enjoyment },
    { label: "Impact", type: "impact", value: review.impact },
    { label: "Status", type: "status", value: review.status },
  ] as const

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
    <PageScroller id="scroll-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />

      <header className="relative min-h-[calc(100dvh-var(--nav-height))] snap-start snap-always overflow-x-hidden py-6">
        <GradientBackground />
        <div className="container mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <BackLink href="/reviews">Back to reviews</BackLink>

          <div className="image-ring relative aspect-video overflow-hidden rounded-3xl bg-muted md:aspect-auto md:h-[clamp(14rem,40vh,26rem)]">
            <Image
              src={review.backdrop}
              alt={`Backdrop for ${review.title}`}
              fill
              preload
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 md:grid-cols-[14rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div className="image-ring relative z-10 -mt-28 aspect-[0.68] w-36 overflow-hidden rounded-2xl bg-muted shadow-[0_30px_80px_rgb(0_0_0/0.25)] sm:-mt-24 sm:w-full md:-mt-36 lg:-mt-44 dark:shadow-[0_30px_80px_rgb(0_0_0/0.6)]">
              <Image
                src={review.poster}
                alt={`Poster for ${review.title}`}
                fill
                preload
                sizes="(max-width: 640px) 9rem, 16rem"
                className="object-cover"
              />
              <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-serif text-sm font-bold text-white backdrop-blur-sm">
                {review.overallRating}
                <Star className="size-3.5 fill-amber-300 text-amber-300" />
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <SectionHeading
                eyebrow={review.medium ? `Review · ${review.medium}` : "Review"}
                title={review.title}
                compact
              />
              {review.aka && review.aka.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">AKA</span>{" "}
                  {review.aka.join(" · ")}
                </p>
              )}
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                <CalendarDays className="size-3.5 text-sky-600 dark:text-sky-300" />
                {formatDateRange(review.startDate, review.finishDate)}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <figure className="relative flex flex-col justify-center rounded-3xl border bg-card/60 px-12 py-14 backdrop-blur-sm md:px-16">
              <span
                aria-hidden
                className="text-brand absolute top-4 left-5 font-serif text-7xl leading-none font-bold select-none"
              >
                &ldquo;
              </span>
              <blockquote className="font-serif text-xl leading-relaxed text-pretty italic md:text-2xl">
                {review.shortReview}
              </blockquote>
              <span
                aria-hidden
                className="text-brand absolute right-5 bottom-4 rotate-180 font-serif text-7xl leading-none font-bold select-none"
              >
                &ldquo;
              </span>
            </figure>

            <div className="flex flex-col gap-6 rounded-3xl border bg-card/60 p-6 backdrop-blur-sm md:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex shrink-0 flex-col items-start gap-1 sm:border-r sm:pr-6">
                  <p className={SCORE_LABEL}>Overall</p>
                  <p className="flex items-baseline gap-1 font-serif font-bold">
                    <span className="text-brand text-6xl leading-[1.2] md:text-7xl">
                      {review.overallRating}
                    </span>
                    <span className="text-xl text-muted-foreground">/10</span>
                  </p>
                </div>
                <dl className="grid flex-1 grid-cols-2 gap-4">
                  {scores.map(({ label, type, value }) => (
                    <div key={label} className="space-y-1.5">
                      <dt className={SCORE_LABEL}>{label}</dt>
                      <dd>
                        <ReviewBadge type={type} value={value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="space-y-2 border-t pt-5">
                <p className={SCORE_LABEL}>Tags</p>
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

              <Link
                href="/blog/how-i-review-media"
                className="group mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-300"
              >
                How I rate things
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <ArticleBody toc={review.toc ?? []}>
        <MdxContent components={reviewMdxComponents} />
      </ArticleBody>

      {relatedReviews.length > 0 && (
        <SectionShell
          id="more-reviews"
          eyebrow="Reviews"
          title="More reviews"
          description={
            review.medium
              ? `More ${review.medium.toLowerCase()} and things I finished around the same time.`
              : "Things I finished around the same time."
          }
          buttonHref="/reviews"
          buttonText="View all reviews"
          className="min-h-0"
          compact
          divider
        >
          <GradientBackground />
          <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {relatedReviews.map((entry, idx) => (
              <ReviewCard
                key={entry.slug}
                slug={entry.slug}
                review={entry.review}
                className={idx < 2 ? "block" : "hidden lg:block"}
              />
            ))}
          </div>
        </SectionShell>
      )}

      <ReturnToTop />
    </PageScroller>
  )
}
