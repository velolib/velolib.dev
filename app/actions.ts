"use server"

import { allPosts, allReviews } from "content-collections"
import { slimPost, slimReview } from "../lib/content"
import type { SlimPost, SlimReview } from "../lib/content"

export type { SlimPost, SlimReview } from "../lib/content"

const sortPostsNewestFirst = () =>
  [...allPosts].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

export async function loadMorePosts(
  offset: number,
  limit: number
): Promise<SlimPost[]> {
  const nextBatch = sortPostsNewestFirst().slice(offset, offset + limit)

  return nextBatch.map(slimPost)
}

const sortReviewsNewestFirst = () =>
  [...allReviews].sort(
    (a, b) => b.finishDate.getTime() - a.finishDate.getTime()
  )

export async function loadMoreReviews(
  offset: number,
  limit: number
): Promise<SlimReview[]> {
  const nextBatch = sortReviewsNewestFirst().slice(offset, offset + limit)

  return nextBatch.map(slimReview)
}

export async function getReview(slug: string): Promise<SlimReview | null> {
  const review = allReviews.find((entry) => entry.slug === slug)

  if (!review) {
    return null
  }

  return slimReview(review)
}
