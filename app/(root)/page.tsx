import { Hero } from "@/components/layout/hero"
import type { Metadata } from "next"
import { SectionShell } from "@/components/shared/section-shell"
import { allPosts, allReviews } from "content-collections"
import type { SlimPost, SlimReview } from "@/lib/content"
import { slimPost, slimReview } from "@/lib/content"
import { SECTIONS } from "@/lib/sections"
import { BlogCard } from "@/components/blog/blog-card"
import { ReviewCard } from "@/components/reviews/review-card"
import { ProjectCard } from "@/components/projects/project-card"
import { PROJECTS } from "@/lib/projects"
import { curatedSort } from "@/lib/curated-sort"
import GradientBackground from "@/components/layout/gradient-background"
import { buildOgImageUrl, buildPageMetadata, toAbsoluteUrl } from "@/lib/seo"

const INITIAL_POST_COUNT = 4
const INITIAL_REVIEW_COUNT = 12
const INITIAL_PROJECT_COUNT = 4

export const metadata: Metadata = buildPageMetadata({
  title: "Home",
  description: "velolib.dev is the personal site of Malik (velolib).",
  pathname: "/",
  image: buildOgImageUrl({
    title: "velolib.dev",
    description: "velolib.dev is the personal site of Malik (velolib).",
    eyebrow: "Home",
  }),
})

export default function Page() {
  const latestPosts = allPosts
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, INITIAL_POST_COUNT)
    .map(slimPost) satisfies SlimPost[]

  const latestReviews = allReviews
    .sort((a, b) => curatedSort(a, b))
    .slice(0, INITIAL_REVIEW_COUNT)
    .map(slimReview) satisfies SlimReview[]

  const latestProjects = PROJECTS.slice(0, INITIAL_PROJECT_COUNT)

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "velolib.dev",
    url: toAbsoluteUrl("/"),
    description:
      "Personal site with blog posts, media reviews, and projects by Malik (velolib).",
  }

  return (
    <main className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <SectionShell
        id="blog"
        eyebrow={SECTIONS.blog.eyebrow}
        title={SECTIONS.blog.title}
        description={SECTIONS.blog.description}
        buttonHref="/blog"
        buttonText="View all posts"
      >
        <div className="min-h-0 flex-1">
          <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} slug={post.slug} post={post.post} />
            ))}
          </div>
        </div>
        <GradientBackground inverted />
      </SectionShell>
      <SectionShell
        id="reviews"
        eyebrow={SECTIONS.reviews.eyebrow}
        title={SECTIONS.reviews.title}
        description={SECTIONS.reviews.description}
        buttonHref="/reviews"
        buttonText="View all reviews"
      >
        <div className="min-h-0 flex-1">
          <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
            {latestReviews.map((review, idx) => (
              <ReviewCard
                key={review.slug}
                slug={review.slug}
                review={review.review}
                className={
                  idx < 2
                    ? "block"
                    : idx < 4
                      ? "hidden md:block"
                      : idx < 6
                        ? "hidden lg:block"
                        : idx < 8
                          ? "hidden 2xl:block"
                          : "hidden"
                }
              />
            ))}
          </div>
        </div>
        <GradientBackground />
      </SectionShell>
      <SectionShell
        id="projects"
        eyebrow={SECTIONS.projects.eyebrow}
        title={SECTIONS.projects.title}
        description={SECTIONS.projects.description}
        buttonHref="/projects"
        buttonText="View all projects"
      >
        <div className="min-h-0 flex-1">
          <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {latestProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                description={project.description}
                image={project.image}
                imageAlt={project.imageAlt}
                href={project.href}
              />
            ))}
          </div>
        </div>
        <GradientBackground inverted />
      </SectionShell>
    </main>
  )
}
