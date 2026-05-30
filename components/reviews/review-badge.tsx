import type { HTMLAttributes } from "react"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cva } from "class-variance-authority"

const BADGE_BASE = "border-border/70 bg-muted/40 text-foreground"

const qualityBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      "Gem-Gem":
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      "Gem-Mid":
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      "Gem-Slop":
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      "Mid-Gem":
        "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
      "Mid-Mid":
        "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      "Mid-Slop":
        "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      "Slop-Gem":
        "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      "Slop-Mid":
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      "Slop-Slop":
        "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },
  },
})

const enjoymentBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      "Loved it":
        "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
      "Liked it":
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      Mixed:
        "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
      Meh: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
      "Didn't like it":
        "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
      "Hated it":
        "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },
  },
})

const impactBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      Lingering:
        "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
      Memorable:
        "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
      Fleeting:
        "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
      Forgettable:
        "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300",
    },
  },
})

const mediumBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      Anime:
        "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
      "Live Action":
        "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      Animation:
        "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
      Donghua:
        "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    },
  },
})

const formatBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      Series: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      Movie:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  },
})

const genreBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      Action:
        "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
      Comedy:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
      Drama:
        "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
      Romance:
        "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
      "Sci-Fi":
        "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
      Fantasy:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      Horror:
        "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
      Mystery:
        "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
      "Slice of Life":
        "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
    },
  },
})

const statusBadgeClasses = cva(BADGE_BASE, {
  variants: {
    tone: {
      Finished:
        "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
      Watching:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
      Dropped: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
      Waiting:
        "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
      Canceled:
        "border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-300",
    },
  },
})

function getReviewRatingBadgeClass(rating: number) {
  if (rating >= 9) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
  }

  if (rating >= 7) {
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
  }

  if (rating >= 5) {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
  }

  if (rating >= 3) {
    return "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300"
  }

  return "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
}

type ReviewBadgeType =
  | "rating"
  | "quality"
  | "enjoyment"
  | "impact"
  | "medium"
  | "format"
  | "genre"
  | "status"

type QualityTone = NonNullable<
  Parameters<typeof qualityBadgeClasses>[0]
>["tone"]
type EnjoymentTone = NonNullable<
  Parameters<typeof enjoymentBadgeClasses>[0]
>["tone"]
type ImpactTone = NonNullable<Parameters<typeof impactBadgeClasses>[0]>["tone"]
type MediumTone = NonNullable<Parameters<typeof mediumBadgeClasses>[0]>["tone"]
type FormatTone = NonNullable<Parameters<typeof formatBadgeClasses>[0]>["tone"]
type GenreTone = NonNullable<Parameters<typeof genreBadgeClasses>[0]>["tone"]
type StatusTone = NonNullable<Parameters<typeof statusBadgeClasses>[0]>["tone"]

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
  let classes = ""

  switch (type) {
    case "rating":
      classes = getReviewRatingBadgeClass(Number(value))
      break
    case "quality":
      classes = qualityBadgeClasses({ tone: value as QualityTone })
      break
    case "enjoyment":
      classes = enjoymentBadgeClasses({ tone: value as EnjoymentTone })
      break
    case "impact":
      classes = impactBadgeClasses({ tone: value as ImpactTone })
      break
    case "medium":
      classes = mediumBadgeClasses({ tone: value as MediumTone })
      break
    case "format":
      classes = formatBadgeClasses({ tone: value as FormatTone })
      break
    case "genre":
      classes = genreBadgeClasses({ tone: value as GenreTone })
      break
    case "status":
      classes = statusBadgeClasses({ tone: value as StatusTone })
      break
    default:
      classes = ""
  }

  return (
    <Badge
      variant="outline"
      className={[classes, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {value}
      {type === "rating" && <Star className="h-3 w-3" fill="currentColor" />}
    </Badge>
  )
}
