import type { Post, Review } from "content-collections"

export interface SlimPost {
  slug: string
  post: Pick<
    Post,
    "title" | "description" | "coverImage" | "coverImageAlt" | "pubDate"
  >
}

export interface SlimReview {
  slug: string
  review: Pick<
    Review,
    | "title"
    | "startDate"
    | "finishDate"
    | "aka"
    | "shortReview"
    | "poster"
    | "backdrop"
    | "overallRating"
    | "quality"
    | "enjoyment"
    | "impact"
    | "status"
    | "medium"
    | "formats"
    | "genres"
  >
}

export function slimPost(post: Post): SlimPost {
  return {
    slug: post.slug,
    post: {
      title: post.title,
      description: post.description,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      pubDate: post.pubDate,
    },
  }
}

export function slimReview(review: Review): SlimReview {
  return {
    slug: review.slug,
    review: {
      title: review.title,
      startDate: review.startDate,
      finishDate: review.finishDate,
      aka: review.aka,
      shortReview: review.shortReview,
      poster: review.poster,
      backdrop: review.backdrop,
      overallRating: review.overallRating,
      quality: review.quality,
      enjoyment: review.enjoyment,
      impact: review.impact,
      status: review.status,
      medium: review.medium,
      formats: review.formats,
      genres: review.genres,
    },
  }
}
