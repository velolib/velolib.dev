import type {
  REVIEW_ENJOYMENTS,
  REVIEW_FORMATS,
  REVIEW_GENRES,
  REVIEW_IMPACTS,
  REVIEW_MEDIUMS,
  REVIEW_QUALITIES,
  REVIEW_STATUSES,
} from "@/lib/review-taxonomy"

// Literal class strings so Tailwind can see them. Shared colour keys are also
// used by the OG image renderer, which maps them to raw RGB values.
export const TONE_CLASSES = {
  red: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  orange:
    "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  amber:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  yellow:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  lime: "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-300",
  green:
    "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
  emerald:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  teal: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  indigo:
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  violet:
    "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  purple:
    "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
  fuchsia:
    "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  pink: "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  slate:
    "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  gray: "border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-300",
  zinc: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  neutral:
    "border-neutral-500/30 bg-neutral-500/10 text-neutral-700 dark:text-neutral-300",
  stone:
    "border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300",
} as const

export type ToneColor = keyof typeof TONE_CLASSES

// Every value within a group gets its own colour, picked to match its icon.

export const QUALITY_TONES = {
  "Gem-Gem": "amber", // crown, gold
  "Gem-Mid": "emerald", // gem
  "Gem-Slop": "orange", // flame
  "Mid-Gem": "purple", // flask, experimental
  "Mid-Mid": "slate", // scale, neutral middle
  "Mid-Slop": "stone", // cardboard box
  "Slop-Gem": "fuchsia", // sparkles in the rough
  "Slop-Mid": "yellow", // pizza
  "Slop-Slop": "red", // trash
} satisfies Record<(typeof REVIEW_QUALITIES)[number], ToneColor>

export const ENJOYMENT_TONES = {
  "Loved it": "rose",
  "Liked it": "green",
  Mixed: "indigo",
  Meh: "zinc",
  "Didn't like it": "orange",
  "Hated it": "red",
} satisfies Record<(typeof REVIEW_ENJOYMENTS)[number], ToneColor>

export const IMPACT_TONES = {
  Lingering: "violet",
  Memorable: "blue",
  Fleeting: "sky",
  Forgettable: "gray",
} satisfies Record<(typeof REVIEW_IMPACTS)[number], ToneColor>

export const STATUS_TONES = {
  Finished: "green",
  Watching: "blue", // playing
  Dropped: "red",
  Waiting: "amber", // paused
  Canceled: "neutral",
} satisfies Record<(typeof REVIEW_STATUSES)[number], ToneColor>

export const MEDIUM_TONES = {
  "Live Action": "amber",
  Anime: "pink",
  Animation: "cyan",
  Donghua: "red",
  Book: "orange",
  Manga: "violet",
  "Light Novel": "indigo",
} satisfies Record<(typeof REVIEW_MEDIUMS)[number], ToneColor>

// Avoids the medium colours, since a medium and a format usually sit together.
export const FORMAT_TONES = {
  Series: "sky",
  Movie: "yellow",
  Novel: "teal",
  "Light Novel": "indigo", // same value as the medium, same colour
  Comic: "fuchsia",
  Webtoon: "lime",
  Anthology: "purple",
  "Short Story": "emerald",
} satisfies Record<(typeof REVIEW_FORMATS)[number], ToneColor>

export const GENRE_TONES = {
  Action: "red",
  Comedy: "yellow",
  Drama: "indigo",
  Romance: "rose",
  "Sci-Fi": "cyan",
  Fantasy: "purple",
  Horror: "slate",
  Mystery: "blue",
  "Slice of Life": "orange",
} satisfies Record<(typeof REVIEW_GENRES)[number], ToneColor>

const REVIEW_TONES: Record<string, Record<string, ToneColor>> = {
  quality: QUALITY_TONES,
  enjoyment: ENJOYMENT_TONES,
  impact: IMPACT_TONES,
  status: STATUS_TONES,
  medium: MEDIUM_TONES,
  format: FORMAT_TONES,
  genre: GENRE_TONES,
}

export function getRatingTone(rating: number): ToneColor {
  if (rating >= 9) return "emerald"
  if (rating >= 7) return "lime"
  if (rating >= 5) return "yellow"
  if (rating >= 3) return "orange"
  return "red"
}

export function getReviewTone(
  type: string,
  value: string | number
): ToneColor | undefined {
  if (type === "rating") return getRatingTone(Number(value))
  return REVIEW_TONES[type]?.[String(value)]
}
