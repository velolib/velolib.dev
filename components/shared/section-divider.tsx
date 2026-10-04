import { cn } from "@/lib/utils"

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-sky-300/60" />
      <span className="size-2.5 rotate-45 rounded-[2px] bg-linear-to-br from-sky-300 to-sea-300" />
      <span className="h-px flex-1 bg-linear-to-r from-sea-300/60 to-transparent" />
    </div>
  )
}
