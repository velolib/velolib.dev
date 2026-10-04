import Link from "next/link"
import { cn } from "@/lib/utils"

export interface WordmarkProps {
  className?: string
  onClick?: () => void
}

export function Wordmark({ className, onClick }: WordmarkProps) {
  return (
    <Link
      href="/#home"
      aria-label="velolib.dev home"
      onClick={onClick}
      className={cn(
        "group flex items-baseline gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex items-baseline">
        <span className="text-brand font-serif text-xl font-bold tracking-tight sm:text-2xl">
          velolib
        </span>
        <span className="font-mono text-base text-muted-foreground transition-colors group-hover:text-foreground sm:text-lg">
          .dev
        </span>
      </span>
      <span className="relative -top-px rounded-md border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 font-mono text-xs text-sky-700 transition-all group-hover:-translate-y-0.5 group-hover:bg-sky-500/15 dark:text-sky-300">
        @malik
      </span>
    </Link>
  )
}
