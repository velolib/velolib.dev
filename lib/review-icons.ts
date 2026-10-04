import {
  Angry,
  Bookmark,
  Box,
  Brain,
  CircleCheck,
  CirclePause,
  CirclePlay,
  CircleSlash,
  CircleX,
  CloudFog,
  Crown,
  Drama,
  FlaskConical,
  Flame,
  Frown,
  Gem,
  Heart,
  Meh,
  Pizza,
  Scale,
  Smile,
  Sparkles,
  Trash2,
  Wind,
  type LucideIcon,
} from "lucide-react"
import type {
  REVIEW_ENJOYMENTS,
  REVIEW_IMPACTS,
  REVIEW_QUALITIES,
  REVIEW_STATUSES,
} from "@/lib/review-taxonomy"

export const QUALITY_ICONS = {
  "Gem-Gem": Crown,
  "Gem-Mid": Gem,
  "Gem-Slop": Flame,
  "Mid-Gem": FlaskConical,
  "Mid-Mid": Scale,
  "Mid-Slop": Box,
  "Slop-Gem": Sparkles,
  "Slop-Mid": Pizza,
  "Slop-Slop": Trash2,
} satisfies Record<(typeof REVIEW_QUALITIES)[number], LucideIcon>

export const ENJOYMENT_ICONS = {
  "Loved it": Heart,
  "Liked it": Smile,
  Mixed: Drama,
  Meh: Meh,
  "Didn't like it": Frown,
  "Hated it": Angry,
} satisfies Record<(typeof REVIEW_ENJOYMENTS)[number], LucideIcon>

export const IMPACT_ICONS = {
  Lingering: Brain,
  Memorable: Bookmark,
  Fleeting: Wind,
  Forgettable: CloudFog,
} satisfies Record<(typeof REVIEW_IMPACTS)[number], LucideIcon>

export const STATUS_ICONS = {
  Finished: CircleCheck,
  Watching: CirclePlay,
  Dropped: CircleX,
  Waiting: CirclePause,
  Canceled: CircleSlash,
} satisfies Record<(typeof REVIEW_STATUSES)[number], LucideIcon>

const REVIEW_ICONS: Record<string, Record<string, LucideIcon>> = {
  quality: QUALITY_ICONS,
  enjoyment: ENJOYMENT_ICONS,
  impact: IMPACT_ICONS,
  status: STATUS_ICONS,
}

export function getReviewIcon(type: string, value: string | number) {
  return REVIEW_ICONS[type]?.[String(value)]
}
