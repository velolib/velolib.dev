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
    | "aka"
    | "startDate"
    | "finishDate"
    | "overallRating"
    | "quality"
    | "shortReview"
    | "medium"
    | "formats"
    | "genres"
    | "status"
    | "enjoyment"
    | "impact"
    | "poster"
    | "backdrop"
    | "draft"
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
      aka: review.aka,
      startDate: review.startDate,
      finishDate: review.finishDate,
      overallRating: review.overallRating,
      quality: review.quality,
      shortReview: review.shortReview,
      medium: review.medium,
      formats: review.formats,
      genres: review.genres,
      status: review.status,
      enjoyment: review.enjoyment,
      impact: review.impact,
      poster: review.poster,
      backdrop: review.backdrop,
      draft: review.draft,
    },
  }
}
