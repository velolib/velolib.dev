"use client"

import { ArrowUp } from "lucide-react"

export function FooterSummitButton() {
  return (
    <button
      type="button"
      onClick={(e) =>
        e.currentTarget
          .closest("main")
          ?.scrollTo({ top: 0, behavior: "smooth" })
      }
      className="group inline-flex items-center gap-1.5 rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      Back to the summit
      <ArrowUp className="size-3.5 text-sky-600 transition-transform group-hover:-translate-y-0.5 dark:text-sky-300" />
    </button>
  )
}
