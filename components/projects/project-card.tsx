"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

interface ProjectCardProps {
  slug: string
  title: string
  description: string
  image: string
  imageAlt: string
  href?: string
}

export function ProjectCard({
  slug,
  title,
  description,
  image,
  imageAlt,
  href,
}: ProjectCardProps) {
  const isExternal = href?.startsWith("http")
  const linkHref = href || `/projects/${slug}`

  const cardContent = (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-all group-hover:border-primary group-focus-visible:border-primary">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t p-6 transition-colors group-hover:border-primary">
        <div className="space-y-2">
          <CardTitle className="text-xl leading-tight text-balance">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm leading-6">
            {description}
          </CardDescription>
        </div>
      </div>
    </Card>
  )

  if (isExternal) {
    return (
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        {cardContent}
      </a>
    )
  }

  return (
    <Link href={linkHref} className="group block h-full">
      {cardContent}
    </Link>
  )
}
