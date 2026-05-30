import { allReviews } from "content-collections"
import type { Metadata } from "next"

import { ReviewLoadMore } from "@/components/reviews/review-load-more"
import { SectionShell } from "@/components/shared/section-shell"
import type { SlimReview } from "@/lib/content"
import { slimReview } from "@/lib/content"
import { SECTIONS } from "@/lib/sections"
import GradientBackground from "@/components/layout/gradient-background"
import { buildOgImageUrl, buildPageMetadata } from "@/lib/seo"

const INITIAL_REVIEW_COUNT = 12

export const metadata: Metadata = buildPageMetadata({
  title: "Reviews",
  description:
    "Browse media reviews by velolib, including anime, films, and series with concise ratings and notes.",
  pathname: "/reviews",
  keywords: ["reviews", "anime reviews", "media reviews", "velolib"],
  image: buildOgImageUrl({
    title: SECTIONS.reviews.title,
    description: SECTIONS.reviews.description,
    eyebrow: SECTIONS.reviews.eyebrow,
  }),
})

export default function ReviewsPage() {
  const sortedReviews = [...allReviews].sort(
    (a, b) => b.finishDate.getTime() - a.finishDate.getTime()
  )

  const slimReviews = sortedReviews.map(slimReview) satisfies SlimReview[]

  return (
    <main className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth">
      <SectionShell
        id="reviews"
        title={SECTIONS.reviews.title}
        eyebrow={SECTIONS.reviews.eyebrow}
        description={SECTIONS.reviews.description}
      >
        <GradientBackground />
        <ReviewLoadMore
          allReviews={slimReviews}
          initialVisibleCount={INITIAL_REVIEW_COUNT}
        />
      </SectionShell>
    </main>
  )
}
