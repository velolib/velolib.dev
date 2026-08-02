"use client"

import Image from "next/image"
import type { MediaData } from "@/lib/grid"
import { Button } from "@/components/ui/button"
import { X, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  media: MediaData | null
  showTitle?: boolean
  showLabel?: boolean
  onEditLabel?: (label: string) => void
  onRemove?: () => void
  editable?: boolean
  onClick?: () => void
  isSquare?: boolean
}

export function MediaCard({
  media,
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
      <Button
        onClick={onClick}
        className="group relative aspect-square h-full w-full overflow-hidden rounded-2xl"
        variant="outline"
      >
        <div className="flex h-full items-center justify-center">
          <span className="text-3xl font-light">+</span>
        </div>
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-lg",
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
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.webp"
        }}
      />

      {editable && (
        <div className="absolute inset-0 flex flex-col items-end justify-start p-2">
          {onRemove && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              variant="destructive"
              size="icon"
              title="Remove"
            >
              <X className="size-4.5" />
            </Button>
          )}
        </div>
      )}

      {(showTitle || showLabel) && (
        <div className="absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-center gap-1 bg-black/60 p-2 text-center">
          {showTitle && (
            <p className="line-clamp-2 text-sm font-semibold text-white">
              {media.title}
            </p>
          )}
          {showLabel && (
            <label className="group/label relative flex w-full cursor-text items-center">
              <input
                type="text"
                value={media.label}
                onChange={(e) => onEditLabel?.(e.target.value)}
                placeholder="Enter label"
                className={cn(
                  "w-full bg-transparent px-6 text-center text-white focus:outline-none",
                  showTitle ? "text-xs" : "text-sm font-semibold"
                )}
                readOnly={!onEditLabel}
                maxLength={20}
              />
              {onEditLabel && (
                <Pencil className="absolute right-1 size-3.5 text-white/50 transition-opacity group-hover/label:text-white/90" />
              )}
            </label>
          )}
        </div>
      )}
    </div>
  )
}
