import {
  createDefaultImport,
  defineCollection,
  defineConfig,
} from "@content-collections/core"
import { readFile } from "node:fs/promises"
import path from "node:path"
import GithubSlugger from "github-slugger"
import type { MDXContent } from "mdx/types"
import { z } from "zod"

import {
  REVIEW_FORMATS,
  REVIEW_GENRES,
  REVIEW_MEDIUMS,
} from "./lib/review-taxonomy"

type TocEntry = {
  level: number
  text: string
  slug: string
}

const headingRegex = /^(#{1,6})\s+(.+)$/gm

function extractToc(source: string): TocEntry[] {
  const slugger = new GithubSlugger()
  const toc: TocEntry[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length

    if (level >= 2 && level <= 3) {
      toc.push({
        level,
        text: match[2].trim(),
        slug: slugger.slug(match[2]),
      })
    } else if (level == 1) {
      throw new Error(
        `Heading level 1 is not allowed in content files. Found heading: "${match[0]}"`
      )
    }
  }

  return toc
}

async function readCollectionSource(
  collectionName: "posts" | "reviews",
  filePath: string
) {
  const absolutePath = path.join(
    process.cwd(),
    "content",
    collectionName,
    filePath
  )

  return readFile(absolutePath, "utf8")
}

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  parser: "frontmatter-only",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    coverImageAlt: z.string(),
    pubDate: z.string().transform((str) => new Date(str)),
  }),
  transform: async ({ _meta, ...post }) => {
    const [source, mdxContent] = await Promise.all([
      readCollectionSource("posts", _meta.filePath),
      Promise.resolve(
        createDefaultImport<MDXContent>(`@/content/posts/${_meta.filePath}`)
      ),
    ])

    return {
      ...post,
      slug: _meta.filePath.replace(/\.(md|mdx)$/i, ""),
      mdxContent,
      toc: extractToc(source),
    }
  },
})

const reviews = defineCollection({
  name: "reviews",
  directory: "content/reviews",
  include: "**/*.mdx",
  parser: "frontmatter-only",
  schema: z.object({
    title: z.string(),
    aka: z.preprocess(
      (value) => (value == null ? [] : value),
      z.array(z.string()).default([])
    ),
    startDate: z.coerce.date(),
    finishDate: z.coerce.date(),
    overallRating: z.number().min(0).max(10),
    quality: z.enum([
      "Gem-Gem",
      "Gem-Mid",
      "Gem-Slop",
      "Mid-Gem",
      "Mid-Mid",
      "Mid-Slop",
      "Slop-Gem",
      "Slop-Mid",
      "Slop-Slop",
    ]),
    shortReview: z.string(),
    medium: z.enum(REVIEW_MEDIUMS),
    formats: z.array(z.enum(REVIEW_FORMATS)).min(1),
    genres: z.array(z.enum(REVIEW_GENRES)).min(1).max(3),
    status: z.enum(["Finished", "Watching", "Dropped", "Waiting", "Canceled"]),
    enjoyment: z.enum([
      "Loved it",
      "Liked it",
      "Mixed",
      "Meh",
      "Didn't like it",
      "Hated it",
    ]),
    impact: z.enum(["Lingering", "Memorable", "Fleeting", "Forgettable"]),
    poster: z.string().optional(),
    backdrop: z.string().optional(),
    draft: z.boolean().default(false),
  }),
  transform: async ({ _meta, ...review }) => {
    const [source, mdxContent] = await Promise.all([
      readCollectionSource("reviews", _meta.filePath),
      Promise.resolve(
        createDefaultImport<MDXContent>(`@/content/reviews/${_meta.filePath}`)
      ),
    ])

    const slug = _meta.filePath.replace(/\.(md|mdx)$/i, "")

    return {
      ...review,
      slug,
      // If poster/backdrop are omitted from frontmatter, infer from slug
      poster: review.poster ?? `/images/reviews/${slug}/poster.webp`,
      backdrop: review.backdrop ?? `/images/reviews/${slug}/backdrop.webp`,
      mdxContent,
      toc: extractToc(source),
    }
  },
})

export default defineConfig({
  content: [posts, reviews],
})
