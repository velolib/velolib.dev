import { SectionShell } from "@/components/shared/section-shell"
import { BlogLoadMore } from "@/components/blog/blog-load-more"
import { SECTIONS } from "@/lib/sections"
import { allPosts } from "content-collections"
import type { Metadata } from "next"
import type { SlimPost } from "../../lib/content"
import { slimPost } from "../../lib/content"
import GradientBackground from "@/components/layout/gradient-background"
import { buildOgImageUrl, buildPageMetadata } from "@/lib/seo"

const INITIAL_POST_COUNT = 8

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Read blog posts from velolib about ideas, experiments, and practical insights.",
  pathname: "/blog",
  keywords: ["blog", "writing", "notes", "velolib"],
  image: buildOgImageUrl({
    title: SECTIONS.blog.title,
    description: SECTIONS.blog.description,
    eyebrow: SECTIONS.blog.eyebrow,
  }),
})

export default async function BlogPage() {
  const sortedPosts = [...allPosts].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  )

  const slimPosts = sortedPosts
    .slice(0, INITIAL_POST_COUNT)
    .map(slimPost) satisfies SlimPost[]

  return (
    <main className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth">
      <SectionShell
        id="blog"
        title={SECTIONS.blog.title}
        eyebrow={SECTIONS.blog.eyebrow}
        description={SECTIONS.blog.description}
      >
        <GradientBackground />
        <BlogLoadMore
          initialPosts={slimPosts}
          totalPosts={sortedPosts.length}
        />
      </SectionShell>
    </main>
  )
}
