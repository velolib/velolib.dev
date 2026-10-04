"use client"

import Image from "next/image"
import type { MediaData } from "@/lib/grid"
import { Button } from "@/components/ui/button"
import { X, Pencil, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  media: MediaData | null
  index: number
  showTitle?: boolean
  showLabel?: boolean
  onEditLabel?: (label: string) => void
  onRemove?: () => void
  editable?: boolean
  onClick?: () => void
  isSquare?: boolean
}

export function MediaSlotNumber({
  index,
  className,
}: {
  index: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "absolute top-3 left-3 z-10 rounded-full border px-2 py-0.5 font-mono text-xs",
        className
      )}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  )
}

export function MediaCard({
  media,
  index,
  showTitle = true,
  showLabel = true,
  onEditLabel,
  onRemove,
  editable = false,
  isSquare = true,
  onClick,
}: MediaCardProps) {
  if (!media) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Add media to slot ${index + 1}`}
        className={cn(
          "group relative flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card/40 text-muted-foreground transition-[color,border-color,background-color] duration-300 outline-none hover:border-sky-300/70 hover:bg-sky-300/5 hover:text-foreground focus-visible:border-sky-300/70 focus-visible:ring-[3px] focus-visible:ring-ring/50",
          isSquare ? "aspect-square" : "aspect-2/3"
        )}
      >
        <MediaSlotNumber index={index} className="bg-background/60" />
        <span className="flex size-12 items-center justify-center rounded-full border bg-background/60 transition-[color,border-color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:border-sky-300/60 group-hover:text-sky-600 dark:group-hover:text-sky-300">
          <Plus className="size-5" />
        </span>
        <span className="text-xs font-medium tracking-[0.24em] uppercase">
          Add media
        </span>
      </button>
    )
  }

  return (
    <div
      className={cn(
        "group image-ring relative w-full overflow-hidden rounded-2xl bg-muted",
        isSquare ? "aspect-square" : "aspect-2/3"
      )}
    >
      <Image
        unoptimized
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        width={600}
        height={900}
        src={media.posterUrl || "/images/placeholder.webp"}
        alt={media.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.webp"
        }}
      />

      <MediaSlotNumber
        index={index}
        className="border-white/15 bg-black/40 text-white backdrop-blur-sm"
      />

      {editable && onRemove && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          variant="ghost"
          size="icon-sm"
          aria-label="Remove"
          title="Remove"
          className="absolute top-2 right-2 z-10 border-white/15 bg-black/40 text-white backdrop-blur-sm hover:bg-destructive/80 hover:text-white dark:hover:bg-destructive/80"
        >
          <X />
        </Button>
      )}

      {(showTitle || showLabel) && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 to-transparent to-60%" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 sm:p-4">
            {showTitle && (
              <p className="line-clamp-2 font-serif text-sm leading-snug font-bold text-balance text-white sm:text-base">
                {media.title}
              </p>
            )}
            {showLabel && (
              <label className="group/label relative flex w-full cursor-text items-center">
                <input
                  type="text"
                  value={media.label}
                  onChange={(e) => onEditLabel?.(e.target.value)}
                  placeholder={onEditLabel ? "Add a label" : undefined}
                  className={cn(
                    "w-full rounded-md bg-transparent pr-6 text-white placeholder:text-white/50 focus:outline-none",
                    showTitle
                      ? "font-mono text-xs text-sky-200"
                      : "font-serif text-sm font-bold sm:text-base"
                  )}
                  readOnly={!onEditLabel}
                  maxLength={20}
                />
                {onEditLabel && (
                  <Pencil className="pointer-events-none absolute right-0 size-3.5 text-white/50 transition-colors group-focus-within/label:text-sky-200 group-hover/label:text-white/90" />
                )}
              </label>
            )}
          </div>
        </>
      )}
    </div>
  )
}
