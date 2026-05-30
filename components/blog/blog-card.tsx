"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { SlimPost } from "../../lib/content"

export function BlogCard({ slug, post }: SlimPost) {
  const { title, description, coverImage, coverImageAlt, pubDate } = post
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-all group-hover:border-primary group-focus-visible:border-primary">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={coverImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 border-t p-6 transition-colors group-hover:border-primary">
          <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {formatDate(pubDate)}
          </p>

          <div className="space-y-2">
            <CardTitle className="text-xl leading-tight text-balance">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm leading-6">
              {description}
            </CardDescription>
          </div>

          <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary">
            Read post
            <ArrowRight className="h-4 w-4 transition-transform duration-300" />
          </span>
        </div>
      </Card>
    </Link>
  )
}
