import type { ReactNode } from "react"
import { XIcon } from "lucide-react"

import ReviewBadge, { type ReviewBadgeType } from "./review-badge"
import { cn } from "@/lib/utils"

interface ReviewFilterChipProps {
  type: ReviewBadgeType
  value: string | number
  selected: boolean
  onToggle: () => void
  /** Number of reviews this option would match. */
  count?: number
  disabled?: boolean
  /** Shows a remove icon instead of the count, for the active filters row. */
  removable?: boolean
  children?: ReactNode
}

export function ReviewFilterChip({
  type,
  value,
  selected,
  onToggle,
  count,
  disabled = false,
  removable = false,
  children,
}: ReviewFilterChipProps) {
  const label = typeof children === "string" ? children : String(value)

  return (
    <ReviewBadge
      type={type}
      value={value}
      muted={!selected}
      render={
        <button
          type="button"
          aria-pressed={removable ? undefined : selected}
          aria-label={removable ? `Remove ${label} filter` : undefined}
          disabled={disabled}
          onClick={onToggle}
        />
      }
      className={cn(
        "h-7 cursor-pointer gap-1.5 px-2.5 transition-[background-color,border-color,box-shadow,opacity] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
        !selected && "hover:border-foreground/20 hover:bg-muted"
      )}
      suffix={
        removable ? (
          <XIcon aria-hidden className="-mr-0.5 opacity-70" />
        ) : count !== undefined ? (
          <span className="text-[0.625rem] tabular-nums opacity-60">
            {count}
          </span>
        ) : null
      }
    >
      {children}
    </ReviewBadge>
  )
}
