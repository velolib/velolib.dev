import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { allPosts } from "content-collections"
import { CalendarDays, Clock, ListTree } from "lucide-react"

import { formatDate } from "@/lib/utils"
import { slimPost } from "@/lib/content"
import ReturnToTop from "@/components/shared/return-to-top"
import { BackLink } from "@/components/shared/back-link"
import { SectionHeading } from "@/components/shared/section-heading"
import { SectionShell } from "@/components/shared/section-shell"
import { ArticleBody } from "@/components/shared/article-body"
import { BlogCard } from "@/components/blog/blog-card"
import { createMdxComponents } from "@/components/mdx/mdx-components"
import GradientBackground from "@/components/layout/gradient-background"
import {
  buildBlogOgImageUrl,
  buildPageMetadata,
  toAbsoluteUrl,
} from "@/lib/seo"
import { PageScroller } from "@/components/layout/page-scroller"

const RELATED_POST_COUNT = 3

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = allPosts.find((entry) => entry.slug === slug)

  if (!post) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.pubDate.toISOString(),
    modifiedTime: post.pubDate.toISOString(),
    keywords: ["blog", "post", post.slug, "velolib"],
    image: buildBlogOgImageUrl({
      title: post.title,
      description: post.description,
      cover: post.coverImage,
      date: formatDate(post.pubDate),
      readingTime: post.readingTime,
      sections: post.toc.length,
    }),
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = allPosts.find((post) => post.slug === slug)
  if (!post) {
    notFound()
  }

  const MdxContent = post.mdxContent
  const mdxComponents = createMdxComponents()

  const relatedPosts = allPosts
    .filter((entry) => entry.slug !== post.slug)
    .sort(
      (a, b) =>
        Math.abs(a.pubDate.getTime() - post.pubDate.getTime()) -
        Math.abs(b.pubDate.getTime() - post.pubDate.getTime())
    )
    .slice(0, RELATED_POST_COUNT)
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .map(slimPost)

  const meta = [
    { icon: CalendarDays, label: formatDate(post.pubDate) },
    { icon: Clock, label: `${post.readingTime} min read` },
    ...(post.toc.length > 0
      ? [
          {
            icon: ListTree,
            label: `${post.toc.length} ${post.toc.length === 1 ? "section" : "sections"}`,
          },
        ]
      : []),
  ]

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    dateModified: post.pubDate.toISOString(),
    image: [toAbsoluteUrl(post.coverImage)],
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Person",
      name: "Malik",
    },
    publisher: {
      "@type": "Organization",
      name: "velolib.dev",
    },
  }

  return (
    <PageScroller id="scroll-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      <header className="relative flex min-h-[calc(100dvh-var(--nav-height))] snap-start snap-always items-center overflow-x-hidden py-10">
        <GradientBackground />
        <div className="container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:px-8">
          <div className="flex flex-col gap-6">
            <BackLink href="/blog">Back to blog</BackLink>
            <SectionHeading
              eyebrow="Blog"
              title={post.title}
              description={post.description}
            />
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              {meta.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="size-3.5 text-sky-600 dark:text-sky-300" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <figure className="group image-ring relative overflow-hidden rounded-3xl bg-muted shadow-[0_30px_80px_rgb(56_189_248/0.18)]">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt}
              width={1200}
              height={675}
              preload
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="block aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </figure>
        </div>
      </header>

      <ArticleBody toc={post.toc}>
        <MdxContent components={mdxComponents} />
      </ArticleBody>

      {relatedPosts.length > 0 && (
        <SectionShell
          id="keep-reading"
          eyebrow="Blog"
          title="Keep reading"
          description="More posts written around the same time."
          buttonHref="/blog"
          buttonText="View all posts"
          className="min-h-0"
          compact
          divider
        >
          <GradientBackground />
          <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {relatedPosts.map((entry) => (
              <BlogCard key={entry.slug} {...entry} />
            ))}
          </div>
        </SectionShell>
      )}

      <ReturnToTop />
    </PageScroller>
  )
}
