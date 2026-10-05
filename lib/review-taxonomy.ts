export const REVIEW_MEDIUMS = [
  "Live Action",
  "Anime",
  "Animation",
  "Donghua",
  "Book",
  "Manga",
  "Light Novel",
] as const

export const REVIEW_FORMATS = [
  "Series",
  "Movie",
  "Novel",
  "Light Novel",
  "Comic",
  "Webtoon",
  "Anthology",
  "Short Story",
] as const

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

// Facet keys match the ReviewBadge types, so filters reuse their icons and tones.
export const REVIEW_FILTER_SECTIONS = [
  {
    label: "Media",
    facets: [
      { key: "medium", label: "Medium", options: REVIEW_MEDIUMS },
      { key: "format", label: "Format", options: REVIEW_FORMATS },
      { key: "genre", label: "Genre", options: REVIEW_GENRES },
      { key: "status", label: "Status", options: REVIEW_STATUSES },
    ],
  },
  {
    label: "Verdict",
    facets: [
      { key: "quality", label: "Quality", options: REVIEW_QUALITIES },
      { key: "enjoyment", label: "Enjoyment", options: REVIEW_ENJOYMENTS },
      { key: "impact", label: "Impact", options: REVIEW_IMPACTS },
    ],
  },
] as const

export type ReviewFacetKey =
  (typeof REVIEW_FILTER_SECTIONS)[number]["facets"][number]["key"]
