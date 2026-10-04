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
  number?: number
  className?: string
}

export function ReviewCard({
  slug,
  review,
  number,
  className,
}: ReviewCardProps) {
  const formats = review.formats ?? []
  const genres = review.genres ?? []
  const poster = review.poster || "/review-posters/placeholder.jpg"

  return (
    <Link href={`/reviews/${slug}`} className={cn("group h-full", className)}>
      <Card className="card-hover-ring relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-[translate,box-shadow,border-color] duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-sky-300/15 group-focus-visible:border-transparent motion-safe:group-hover:-translate-y-1">
        <div className="relative overflow-hidden bg-muted">
          <Image
            src={poster}
            alt={review.title}
            width={680}
            height={1000}
            className="block aspect-[0.68] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {number ? (
            <span className="absolute top-4 left-4 z-10 rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 font-serif text-xs font-bold text-white backdrop-blur-sm">
              #{String(number).padStart(2, "0")}
            </span>
          ) : null}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent to-70%" />

          <div className="absolute inset-x-0 bottom-0 space-y-3 p-4 sm:p-5">
            <p className="text-xs font-medium tracking-[0.28em] text-white/75 uppercase">
              {formatDateRange(review.startDate, review.finishDate)}
            </p>

            <CardTitle className="line-clamp-2 font-serif text-lg leading-snug font-bold text-balance text-white sm:text-xl">
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

        <div className="flex flex-1 flex-col gap-4 border-t p-6">
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
