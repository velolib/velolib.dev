import { createElement, type HTMLAttributes } from "react"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { getReviewIcon } from "@/lib/review-icons"
import { TONE_CLASSES, getReviewTone } from "@/lib/review-tones"

const BADGE_BASE = "border-border/70 bg-muted/40 text-foreground"

type ReviewBadgeType =
  | "rating"
  | "quality"
  | "enjoyment"
  | "impact"
  | "medium"
  | "format"
  | "genre"
  | "status"

interface ReviewBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  value: string | number
  type: ReviewBadgeType
  className?: string
}

export default function ReviewBadge({
  value,
  type,
  className,
  ...rest
}: ReviewBadgeProps) {
  const tone = getReviewTone(type, value)
  const classes = tone ? TONE_CLASSES[tone] : BADGE_BASE

  const icon = getReviewIcon(type, value)

  return (
    <Badge
      variant="outline"
      className={[classes, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {icon && createElement(icon, { "aria-hidden": true })}
      {value}
      {type === "rating" && <Star className="h-3 w-3" fill="currentColor" />}
    </Badge>
  )
}
