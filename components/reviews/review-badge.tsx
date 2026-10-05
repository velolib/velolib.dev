import {
  createElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { getReviewIcon } from "@/lib/review-icons"
import {
  TONE_CLASSES,
  TONE_ICON_CLASSES,
  getReviewTone,
} from "@/lib/review-tones"

const BADGE_BASE = "border-border/70 bg-muted/40 text-foreground"

export type ReviewBadgeType =
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
  /** Neutral badge with only the icon tinted. */
  muted?: boolean
  /** Replaces the displayed value; tone and icon still come from `value`. */
  children?: ReactNode
  /** Rendered last, after the rating star. */
  suffix?: ReactNode
  render?: ReactElement
  className?: string
}

export default function ReviewBadge({
  value,
  type,
  muted = false,
  children,
  suffix,
  render,
  className,
  ...rest
}: ReviewBadgeProps) {
  const tone = getReviewTone(type, value)
  const classes = tone && !muted ? TONE_CLASSES[tone] : BADGE_BASE
  const iconClass = tone && muted ? TONE_ICON_CLASSES[tone] : undefined

  const icon = getReviewIcon(type, value)

  return (
    <Badge
      variant="outline"
      render={render}
      className={[classes, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {icon &&
        createElement(icon, { "aria-hidden": true, className: iconClass })}
      {children ?? value}
      {type === "rating" && (
        <Star
          className={["h-3 w-3", iconClass].filter(Boolean).join(" ")}
          fill="currentColor"
        />
      )}
      {suffix}
    </Badge>
  )
}
