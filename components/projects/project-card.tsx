"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

interface ProjectCardProps {
  slug: string
  title: string
  kind: string
  description: string
  image: string
  imageAlt: string
  href?: string
}

export function ProjectCard({
  slug,
  title,
  kind,
  description,
  image,
  imageAlt,
  href,
}: ProjectCardProps) {
  const isExternal = href?.startsWith("http")
  const linkHref = href || `/projects/${slug}`
  const Arrow = isExternal ? ArrowUpRight : ArrowRight

  const cardContent = (
    <Card className="card-hover-ring relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-[translate,box-shadow,border-color] duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-sky-300/15 group-focus-visible:border-transparent motion-safe:group-hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t p-6">
        <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
          {kind}
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
          {isExternal ? "Visit" : "View project"}
          <Arrow
            className={
              isExternal
                ? "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                : "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            }
          />
        </span>
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
