import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollToHeader } from "@/components/shared/scroll-to-header"
import type { Metadata } from "next"
import { formatDate } from "@/lib/utils"
import { allPosts } from "content-collections"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ReturnToTop from "@/components/shared/return-to-top"
import Toc from "@/components/shared/toc"
import { createMdxComponents } from "@/components/mdx/mdx-components"
import GradientBackground from "@/components/layout/gradient-background"
import { buildOgImageUrl, buildPageMetadata, toAbsoluteUrl } from "@/lib/seo"

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
    image: buildOgImageUrl({
      title: post.title,
      description: post.description,
      eyebrow: `Blog | ${formatDate(post.pubDate)}`,
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
    <main
      className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth"
      id="scroll-root"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <div className="relative flex flex-col">
        <GradientBackground />
        <article className="container mx-auto flex flex-col gap-10 p-4 pb-10 sm:p-6 md:pb-14 lg:p-8">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            width="1200"
            height="630"
            className="aspect-video w-full rounded-3xl border object-cover"
          />
          <ScrollToHeader>
            <div className="space-y-5">
              <Link
                href="/blog"
                className={buttonVariants({ variant: "outline" })}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.32em] text-muted-foreground uppercase">
                  Blog | {formatDate(post.pubDate)}
                </p>
                <h1 className="text-brand pb-2 font-serif text-5xl font-bold tracking-tight md:text-6xl">
                  {post.title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  {post.description}
                </p>
              </div>
            </div>
          </ScrollToHeader>
          <Separator />
          {post.toc && post.toc.length > 0 && <Toc toc={post.toc} />}
          <article className="prose max-w-none pt-2 text-pretty prose-neutral dark:prose-invert prose-headings:scroll-m-20 prose-headings:tracking-tight prose-a:text-sky-300">
            <MdxContent components={mdxComponents} />
          </article>
        </article>
      </div>
      <ReturnToTop />
    </main>
  )
}
