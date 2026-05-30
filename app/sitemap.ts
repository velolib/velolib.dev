import type { MetadataRoute } from "next"
import { allPosts, allReviews } from "content-collections"

import { toAbsoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/blog"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/reviews"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/projects"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: post.pubDate,
    changeFrequency: "monthly",
    priority: 0.75,
  }))

  const reviewRoutes: MetadataRoute.Sitemap = allReviews.map((review) => ({
    url: toAbsoluteUrl(`/reviews/${review.slug}`),
    lastModified: review.finishDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...reviewRoutes]
}
