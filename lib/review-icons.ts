import {
  Angry,
  BookImage,
  BookOpenText,
  Bookmark,
  Box,
  Brain,
  Castle,
  CircleCheck,
  CirclePause,
  CirclePlay,
  CircleSlash,
  CircleX,
  Clapperboard,
  CloudFog,
  Coffee,
  Crown,
  Drama,
  Feather,
  Fingerprint,
  FlaskConical,
  Flame,
  Frown,
  Gem,
  Heart,
  Laugh,
  Layers,
  Library,
  ListVideo,
  Meh,
  MessageCircleMore,
  Palette,
  Panda,
  Pizza,
  Popcorn,
  Rocket,
  Rose,
  Scale,
  ScrollText,
  Skull,
  Smartphone,
  Smile,
  Sparkles,
  Swords,
  Theater,
  Trash2,
  Tv,
  Wind,
  type LucideIcon,
} from "lucide-react"
import type {
  REVIEW_ENJOYMENTS,
  REVIEW_FORMATS,
  REVIEW_GENRES,
  REVIEW_IMPACTS,
  REVIEW_MEDIUMS,
  REVIEW_QUALITIES,
  REVIEW_STATUSES,
} from "@/lib/review-taxonomy"

// Every icon is used for exactly one meaning across all groups, so a badge can
// be read from its icon alone. "Light Novel" exists as both a medium and a
// format and shares one icon on purpose.

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

export const MEDIUM_ICONS = {
  "Live Action": Clapperboard,
  Anime: Tv,
  Animation: Palette,
  Donghua: Panda,
  Book: Library,
  Manga: BookImage,
  "Light Novel": Feather,
} satisfies Record<(typeof REVIEW_MEDIUMS)[number], LucideIcon>

export const FORMAT_ICONS = {
  Series: ListVideo,
  Movie: Popcorn,
  Novel: BookOpenText,
  "Light Novel": Feather,
  Comic: MessageCircleMore,
  Webtoon: Smartphone,
  Anthology: Layers,
  "Short Story": ScrollText,
} satisfies Record<(typeof REVIEW_FORMATS)[number], LucideIcon>

export const GENRE_ICONS = {
  Action: Swords,
  Comedy: Laugh,
  Drama: Theater,
  Romance: Rose,
  "Sci-Fi": Rocket,
  Fantasy: Castle,
  Horror: Skull,
  Mystery: Fingerprint,
  "Slice of Life": Coffee,
} satisfies Record<(typeof REVIEW_GENRES)[number], LucideIcon>

const REVIEW_ICONS: Record<string, Record<string, LucideIcon>> = {
  quality: QUALITY_ICONS,
  enjoyment: ENJOYMENT_ICONS,
  impact: IMPACT_ICONS,
  status: STATUS_ICONS,
  medium: MEDIUM_ICONS,
  format: FORMAT_ICONS,
  genre: GENRE_ICONS,
}

export function getReviewIcon(type: string, value: string | number) {
  return REVIEW_ICONS[type]?.[String(value)]
}
