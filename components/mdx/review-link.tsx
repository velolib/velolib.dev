"use client"

import Image from "next/image"
import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

import ReviewBadge from "@/components/reviews/review-badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SlimReview } from "@/lib/content"
import { cn, formatCompactDateRange } from "@/lib/utils"
import { useRouter } from "next/navigation"

type MdxLinkProps = ComponentPropsWithoutRef<"a"> & {
  review?: SlimReview
}

function isInternalHref(href?: string) {
  if (!href) {
    return false
  }

  return href.startsWith("/") || href.startsWith("#")
}

function isReviewHref(href?: string) {
  return /^\/reviews\/[^/?#]+\/?(?:[?#].*)?$/.test(href ?? "")
}

function ReviewPreview({ review }: { review: SlimReview }) {
  const data = review.review

  return (
    <div className="w-96 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl border bg-background/95 text-left shadow-2xl backdrop-blur-md">
      <div className="flex items-stretch gap-3 p-3">
        <div className="relative aspect-[0.68] w-16 shrink-0 overflow-hidden rounded-xl border bg-muted">
          <Image
            src={data.poster}
            alt={`Poster for ${data.title}`}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2 py-0.5">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              {formatCompactDateRange(data.startDate, data.finishDate)}
            </p>
            <p className="line-clamp-2 text-sm leading-tight font-semibold text-foreground">
              {data.title}
            </p>
            {data.aka && data.aka.length > 0 && (
              <p className="line-clamp-1 text-[11px] leading-tight text-muted-foreground">
                AKA: {data.aka.join(", ")}
              </p>
            )}
          </div>

          <p className="line-clamp-2 text-[11px] leading-4 text-muted-foreground">
            {data.shortReview}
          </p>
        </div>
      </div>

      <div className="space-y-2 border-t px-3 py-3">
        <div className="flex flex-wrap gap-1.5">
          <ReviewBadge
            type="rating"
            value={data.overallRating}
            className="h-5 px-1.5 text-[10px]"
          />
          <ReviewBadge
            type="quality"
            value={data.quality}
            className="h-5 px-1.5 text-[10px]"
          />
          <ReviewBadge
            type="enjoyment"
            value={data.enjoyment}
            className="h-5 px-1.5 text-[10px]"
          />
          <ReviewBadge
            type="impact"
            value={data.impact}
            className="h-5 px-1.5 text-[10px]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {data.medium && (
            <ReviewBadge
              type="medium"
              value={data.medium}
              className="h-5 px-1.5 text-[10px]"
            />
          )}
          {(data.formats ?? []).map((format) => (
            <ReviewBadge
              key={format}
              type="format"
              value={format}
              className="h-5 px-1.5 text-[10px]"
            />
          ))}
          {(data.genres ?? []).map((genre) => (
            <ReviewBadge
              key={genre}
              type="genre"
              value={genre}
              className="h-5 px-1.5 text-[10px]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReviewLink({
  href,
  className,
  children,
  rel,
  review,
  target,
  ...props
}: MdxLinkProps) {
  const sharedClassName = cn(className)
  const tooltipLabel = review?.review.title
  const shouldShowTooltip = Boolean(tooltipLabel && isReviewHref(href))
  const router = useRouter()

  if (!href) {
    return (
      <a className={sharedClassName} {...props}>
        {children}
      </a>
    )
  }

  const linkElement = isInternalHref(href) ? (
    <Link className={sharedClassName} href={href} {...props}>
      {children}
    </Link>
  ) : (
    <a
      className={sharedClassName}
      href={href}
      rel={target === "_blank" ? (rel ?? "noreferrer noopener") : rel}
      target={target}
      {...props}
    >
      {children}
    </a>
  )

  if (!shouldShowTooltip || !review) {
    return linkElement
  }

  return (
    <Tooltip>
      <TooltipTrigger render={linkElement} />
      <TooltipContent
        side="top"
        className="cursor-pointer border-0 bg-transparent p-0 shadow-none select-none"
        onClick={(e) => {
          e.preventDefault()
          router.push(`/reviews/${review.slug}`)
        }}
      >
        <ReviewPreview review={review} />
      </TooltipContent>
    </Tooltip>
  )
}
