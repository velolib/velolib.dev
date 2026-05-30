import { config, fields, collection } from "@keystatic/core"
import {
  REVIEW_ENJOYMENTS,
  REVIEW_FORMATS,
  REVIEW_GENRES,
  REVIEW_IMPACTS,
  REVIEW_MEDIUMS,
  REVIEW_QUALITIES,
  REVIEW_STATUSES,
} from "./lib/review-taxonomy"
import { block } from "@keystatic/core/content-components"

const ENJOYMENTS = REVIEW_ENJOYMENTS.map((enjoyment) => ({
  label: enjoyment,
  value: enjoyment,
}))
const FORMATS = REVIEW_FORMATS.map((format) => ({
  label: format,
  value: format,
}))
const GENRES = REVIEW_GENRES.map((genre) => ({ label: genre, value: genre }))
const IMPACTS = REVIEW_IMPACTS.map((impact) => ({
  label: impact,
  value: impact,
}))
const MEDIUMS = REVIEW_MEDIUMS.map((medium) => ({
  label: medium,
  value: medium,
}))
const QUALITIES = REVIEW_QUALITIES.map((quality) => ({
  label: quality,
  value: quality,
}))
const STATUSES = REVIEW_STATUSES.map((status) => ({
  label: status,
  value: status,
}))

const keystaticComponents = {
  SpotifyEmbed: block({
    label: "SpotifyEmbed",
    schema: {
      uri: fields.text({ label: "Spotify ID" }),
    },
  }),
}

export default config({
  storage: {
    kind: "github",
    repo: {
      owner: "velolib",
      name: "velolib.dev",
    },
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description" }),
        pubDate: fields.date({ label: "Publication Date" }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        coverImageAlt: fields.text({ label: "Cover Image Alt" }),
        content: fields.mdx({
          label: "Content",
          components: keystaticComponents,
        }),
      },
      columns: ["title", "description", "pubDate"],
    }),
    reviews: collection({
      label: "Reviews",
      slugField: "title",
      path: "content/reviews/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        aka: fields.array(fields.text({ label: "Also Known As" }), {
          label: "Also Known As",
        }),
        startDate: fields.date({ label: "Start Date" }),
        finishDate: fields.date({ label: "Finish Date" }),
        shortReview: fields.text({ label: "Short Review" }),
        poster: fields.image({
          label: "Poster Image",
          directory: "public/images/reviews",
          publicPath: "/images/reviews/",
        }),
        backdrop: fields.image({
          label: "Backdrop Image",
          directory: "public/images/reviews",
          publicPath: "/images/reviews/",
        }),
        overallRating: fields.number({ label: "Overall Rating" }),
        quality: fields.select({
          label: "Quality",
          options: QUALITIES,
          defaultValue: REVIEW_QUALITIES[0],
        }),
        enjoyment: fields.select({
          label: "Enjoyment",
          options: ENJOYMENTS,
          defaultValue: REVIEW_ENJOYMENTS[0],
        }),
        impact: fields.select({
          label: "Impact",
          options: IMPACTS,
          defaultValue: REVIEW_IMPACTS[0],
        }),
        status: fields.select({
          label: "Status",
          options: STATUSES,
          defaultValue: REVIEW_STATUSES[0],
        }),
        medium: fields.select({
          label: "Medium",
          options: MEDIUMS,
          defaultValue: REVIEW_MEDIUMS[0],
        }),
        formats: fields.multiselect({ label: "Formats", options: FORMATS }),
        genres: fields.multiselect({ label: "Genres", options: GENRES }),
        content: fields.mdx({
          label: "Content",
          components: keystaticComponents,
        }),
      },
      columns: [
        "title",
        "startDate",
        "finishDate",
        "overallRating",
        "quality",
        "enjoyment",
        "impact",
        "medium",
        "status",
      ],
    }),
  },
})
