export const REVIEW_MEDIUMS = [
  "Live Action",
  "Anime",
  "Animation",
  "Donghua",
] as const

export const REVIEW_FORMATS = ["Series", "Movie"] as const

export const REVIEW_GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Mystery",
  "Slice of Life",
] as const

export const REVIEW_STATUSES = [
  "Finished",
  "Watching",
  "Dropped",
  "Waiting",
  "Canceled",
] as const

export const REVIEW_QUALITIES = [
  "Gem-Gem",
  "Gem-Mid",
  "Gem-Slop",
  "Mid-Gem",
  "Mid-Mid",
  "Mid-Slop",
  "Slop-Gem",
  "Slop-Mid",
  "Slop-Slop",
] as const

export const REVIEW_ENJOYMENTS = [
  "Loved it",
  "Liked it",
  "Mixed",
  "Meh",
  "Didn't like it",
  "Hated it",
] as const

export const REVIEW_IMPACTS = [
  "Lingering",
  "Memorable",
  "Fleeting",
  "Forgettable",
] as const

export const REVIEW_MEDIA_FILTER_GROUPS = [
  {
    label: "Medium",
    options: REVIEW_MEDIUMS,
  },
  {
    label: "Format",
    options: REVIEW_FORMATS,
  },
  {
    label: "Genres",
    options: REVIEW_GENRES,
  },
] as const

export const REVIEW_ASPECT_FILTER_GROUPS = [
  {
    label: "Quality",
    options: REVIEW_QUALITIES,
  },
  {
    label: "Enjoyment",
    options: REVIEW_ENJOYMENTS,
  },
  {
    label: "Impact",
    options: REVIEW_IMPACTS,
  },
] as const
