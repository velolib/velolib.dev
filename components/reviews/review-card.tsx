"use client"

import Image from "next/image"
import Link from "next/link"

import type { SlimReview } from "../../lib/content"
import ReviewBadge from "./review-badge"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDateRange } from "@/lib/utils"

interface ReviewCardProps {
  slug: string
  review: SlimReview["review"]
  className?: string
}

export function ReviewCard({ slug, review, className }: ReviewCardProps) {
  const formats = review.formats ?? []
  const genres = review.genres ?? []

  return (
    <Link href={`/reviews/${slug}`} className={cn("group h-full", className)}>
      <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-all group-hover:border-primary group-focus-visible:border-primary">
        <div className="relative overflow-hidden bg-muted">
          <Image
            src={review.poster || "/review-posters/placeholder.jpg"}
            alt={review.title}
            width={680}
            height={1000}
            className="block aspect-[0.68] w-full object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent to-60%" />

          <div className="absolute inset-x-0 bottom-0 space-y-3 p-4 sm:p-5">
            <p className="text-xs font-medium tracking-[0.28em] text-white/75 uppercase">
              {formatDateRange(review.startDate, review.finishDate)}
            </p>

            <CardTitle className="line-clamp-2 text-lg leading-tight text-balance text-white sm:text-xl">
              {review.title}
            </CardTitle>

            <div className="dark flex flex-wrap gap-2">
              <ReviewBadge type="rating" value={review.overallRating} />
              <ReviewBadge type="quality" value={review.quality} />
              <ReviewBadge type="enjoyment" value={review.enjoyment} />
              <ReviewBadge type="impact" value={review.impact} />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 border-t border-border p-6 transition-colors group-hover:border-primary">
          <CardDescription className="line-clamp-3 text-sm leading-6">
            {review.shortReview}
          </CardDescription>

          <div className="mt-auto flex flex-wrap gap-2">
            {review.medium && (
              <ReviewBadge type="medium" value={review.medium} />
            )}
            {formats.map((format) => (
              <ReviewBadge key={format} type="format" value={format} />
            ))}
            {genres.map((genre) => (
              <ReviewBadge key={genre} type="genre" value={genre} />
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
