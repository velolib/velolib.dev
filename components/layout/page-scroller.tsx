import { cn } from "@/lib/utils"
import { SiteFooter } from "./site-footer"

export interface PageScrollerProps {
  children: React.ReactNode
  id?: string
  snap?: boolean
  className?: string
}

export function PageScroller({
  children,
  id,
  snap = true,
  className,
}: PageScrollerProps) {
  return (
    <main
      id={id}
      className={cn(
        "relative h-[calc(100dvh-var(--nav-height))] overflow-x-hidden overflow-y-auto",
        // Consistent gap between the last section and the footer on every page
        "[&>section:last-of-type]:pb-12 md:[&>section:last-of-type]:pb-16",
        snap && "snap-y snap-proximity scroll-smooth",
        className
      )}
    >
      {children}
      <SiteFooter />
    </main>
  )
}
