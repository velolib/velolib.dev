import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import GradientBackground from "@/components/layout/gradient-background"
import { SectionHeading } from "@/components/shared/section-heading"
import { TopoZero } from "@/components/shared/topo-zero"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PageScroller } from "@/components/layout/page-scroller"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <PageScroller snap={false}>
      <section className="relative flex min-h-full items-center py-10">
        <GradientBackground />
        <div className="container mx-auto grid items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:px-8">
          <div
            aria-hidden
            className="flex items-baseline justify-center font-serif text-[7.5rem] leading-none font-bold tracking-tight select-none sm:text-[10rem] xl:text-[13rem]"
          >
            <span className="text-brand">4</span>
            <TopoZero className="mx-[0.06em] h-[0.74em] w-auto" />
            <span className="text-brand">4</span>
          </div>

          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <SectionHeading
              className="*:max-lg:mx-auto"
              eyebrow="Error 404"
              title="Off the map"
              description="This isn't the page you're looking for. The page may have moved, a shared grid may have expired, or the link was never real."
            />

            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "btn-brand group relative w-fit border-transparent hover:bg-sky-300/10"
              )}
            >
              Back to home
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageScroller>
  )
}
