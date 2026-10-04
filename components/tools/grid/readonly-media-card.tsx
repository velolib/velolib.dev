import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { MediaSlotNumber } from "@/components/tools/grid/media-card"

interface ReadonlyMediaCardProps {
  index: number
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
  index,
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
        aria-hidden
        className={cn(
          "relative w-full rounded-2xl border border-dashed bg-card/40 text-muted-foreground",
          isSquare ? "aspect-square" : "aspect-2/3"
        )}
      >
        <MediaSlotNumber index={index} className="bg-background/60" />
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

  const caption = (showTitle && title) || (showLabel && label)

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group image-ring relative block w-full overflow-hidden rounded-2xl bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
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
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <MediaSlotNumber
        index={index}
        className="border-white/15 bg-black/40 text-white backdrop-blur-sm"
      />

      {caption && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-black/85 to-transparent to-60%" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 sm:p-4">
            {showTitle && title && (
              <p className="line-clamp-2 font-serif text-sm leading-snug font-bold text-balance text-white sm:text-base">
                {title}
              </p>
            )}
            {showLabel && label && (
              <p
                className={cn(
                  "truncate",
                  showTitle
                    ? "font-mono text-xs text-sky-200"
                    : "font-serif text-sm font-bold text-white sm:text-base"
                )}
              >
                {label}
              </p>
            )}
          </div>
        </>
      )}
    </Link>
  )
}
