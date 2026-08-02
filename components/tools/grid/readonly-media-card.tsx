import { cn } from "@/lib/utils"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

interface ReadonlyMediaCardProps {
  id?: string
  type?: string
  posterUrl?: string
  title?: string
  label?: string
  showTitle?: boolean
  showLabel?: boolean
  isSquare?: boolean
}

export function ReadonlyMediaCard({
  id,
  type,
  posterUrl,
  title,
  label,
  showTitle = true,
  showLabel = true,
  isSquare = true,
}: ReadonlyMediaCardProps) {
  if (!posterUrl && !title && !label) {
    return (
      <div
        className={cn(
          buttonVariants({ variant: "outline" }),
          "group pointer-events-none relative h-full w-full overflow-hidden rounded-2xl",
          isSquare ? "aspect-square" : "aspect-2/3"
        )}
      >
        <div className="flex h-full items-center justify-center">
          {/* <span className="text-3xl font-light">
            +
          </span> */}
        </div>
      </div>
    )
  }

  let link = "#"
  if (id) {
    switch (type) {
      case "movie":
        link = `https://www.themoviedb.org/movie/${id}`
        break
      case "tv":
        link = `https://www.themoviedb.org/tv/${id}`
        break
    }
  }

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative block w-full overflow-hidden rounded-lg",
        isSquare ? "aspect-square" : "aspect-2/3"
      )}
    >
      <Image
        unoptimized
        width={600}
        height={900}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        src={posterUrl || "/images/placeholder.webp"}
        alt={title ?? "Poster"}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {(title || label) && (
        <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center gap-1 bg-black/60 p-2 text-center">
          {showTitle && (
            <p className="line-clamp-2 text-sm font-semibold text-white">
              {title}
            </p>
          )}

          {showLabel && (
            <p
              className={cn(
                "w-full px-6 text-center text-white",
                showTitle ? "text-xs" : "text-sm font-semibold"
              )}
            >
              {label}
            </p>
          )}
        </div>
      )}
    </Link>
  )
}
