"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { SlimPost } from "../../lib/content"

export function BlogCard({ slug, post }: SlimPost) {
  const {
    title,
    description,
    coverImage,
    coverImageAlt,
    pubDate,
    readingTime,
  } = post
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <Card className="card-hover-ring relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-[translate,box-shadow,border-color] duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-sky-300/15 group-focus-visible:border-transparent motion-safe:group-hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={coverImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 border-t p-6">
          <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {formatDate(pubDate)} · {readingTime} min read
          </p>

          <div className="space-y-2">
            <CardTitle className="font-serif text-xl leading-snug font-bold text-balance">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm leading-6">
              {description}
            </CardDescription>
          </div>

          <span className="mt-auto inline-flex items-center gap-2 border-t pt-4 text-sm font-medium text-primary">
            Read post
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  )
}
