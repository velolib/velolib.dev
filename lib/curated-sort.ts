import type { SlimReview } from "./content"
import type { Review } from "content-collections"

type ReviewLike = SlimReview | Review

function unwrap(r: ReviewLike) {
  return "review" in r ? r.review : r
}

export function curatedSort(a: ReviewLike, b: ReviewLike) {
  const ra = unwrap(a)
  const rb = unwrap(b)
  if (rb.overallRating !== ra.overallRating) {
    return (rb.overallRating ?? 0) - (ra.overallRating ?? 0)
  }

  const qualityOrder = [
    "Gem-Gem",
    "Mid-Gem",
    "Slop-Gem",
    "Gem-Mid",
    "Mid-Mid",
    "Slop-Mid",
    "Gem-Slop",
    "Mid-Slop",
    "Slop-Slop",
  ]

  const qa = qualityOrder.indexOf(ra.quality as string)
  const qb = qualityOrder.indexOf(rb.quality as string)

  if (qa !== qb) {
    return qa - qb
  }

  const enjoymentOrder = [
    "Loved it",
    "Liked it",
    "Mixed",
    "Meh",
    "Didn't like it",
    "Hated it",
  ]

  const ea = enjoymentOrder.indexOf(ra.enjoyment as string)
  const eb = enjoymentOrder.indexOf(rb.enjoyment as string)

  if (ea !== eb) {
    return ea - eb
  }

  const impactOrder = ["Lingering", "Memorable", "Fleeting", "Forgettable"]

  const ia = impactOrder.indexOf(ra.impact as string)
  const ib = impactOrder.indexOf(rb.impact as string)

  if (ia !== ib) {
    return ia - ib
  }

  return (ra.title ?? "").localeCompare(rb.title ?? "")
}
