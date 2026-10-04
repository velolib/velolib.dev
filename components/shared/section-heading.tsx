import { cn } from "@/lib/utils"

export interface SectionHeadingProps {
  eyebrow: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  compact?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  compact = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl space-y-3", className)}>
      <div className="flex w-fit max-w-full flex-col gap-6">
        <p className="flex min-h-5 items-center gap-3 text-sm leading-5 font-medium tracking-[0.32em] text-sky-600 uppercase dark:text-sky-300">
          {eyebrow}
          <span
            aria-hidden
            className="h-1 min-w-8 flex-1 rounded-full bg-linear-to-r from-[color-mix(in_oklch,var(--color-sky-300)_70%,var(--color-sea-300))] to-sea-300"
          />
        </p>
        <h1
          className={cn(
            "text-brand heading-trim font-serif text-5xl leading-[1.3] font-bold tracking-tight text-balance md:text-6xl",
            { "text-4xl md:text-5xl": compact }
          )}
        >
          {title}
        </h1>
        <span aria-hidden className="flex h-5 items-center">
          <span className="h-1 w-full rounded-full bg-linear-to-r from-sky-300 to-sea-300" />
        </span>
      </div>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
