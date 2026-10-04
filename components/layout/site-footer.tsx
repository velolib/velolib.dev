import Link from "next/link"
import { House, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { socialLinks } from "@/lib/social-links"
import { buttonVariants } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import GradientBackground from "./gradient-background"
import { FooterClock } from "./footer-clock"
import { FooterSummitButton } from "./footer-summit-button"

const exploreLinks = [
  { label: "Home", href: "/#home" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Projects", href: "/projects" },
]

const columnHeadingClass =
  "text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase"

export function SiteFooter() {
  return (
    <footer className="relative snap-end overflow-hidden bg-background/55 backdrop-blur-xl">
      <GradientBackground />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-(image:--nav-hairline) opacity-80"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] -top-1 h-2 bg-(image:--nav-hairline) opacity-30 blur-md"
      />

      <div className="relative container mx-auto flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="flex items-center gap-3 text-sm leading-5 font-medium tracking-[0.32em] text-sky-600 uppercase dark:text-sky-300">
            <span aria-hidden className="relative flex size-2.5">
              <span className="absolute inset-0 rounded-full bg-sky-300/60 motion-safe:animate-ping" />
              <span className="relative size-2.5 rounded-full bg-sky-500 dark:bg-sky-300" />
            </span>
            End of the line
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            22.5431° N · 114.0579° E
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="col-span-2 flex flex-col items-start gap-4 lg:col-span-1">
            <p className="font-serif text-2xl leading-tight font-bold tracking-tight text-balance">
              Thanks for wandering <span className="text-brand">this far.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <p className="inline-flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 font-mono text-xs text-rose-700 dark:text-rose-300">
                <MapPin aria-hidden className="size-3.5" />
                <FooterClock timeZone="Asia/Shanghai" />
                <span className="text-muted-foreground">
                  in Shenzhen · UTC+8
                </span>
              </p>
              <p className="inline-flex items-center gap-2 rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-1 font-mono text-xs text-orange-700 dark:text-orange-300">
                <House aria-hidden className="size-3.5" />
                <FooterClock timeZone="Asia/Jakarta" />
                <span className="text-muted-foreground">
                  from Jakarta · UTC+7
                </span>
              </p>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-4">
            <p className={columnHeadingClass}>Explore</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <span
                      aria-hidden
                      className="h-px w-3 bg-linear-to-r from-sky-300 to-sea-300 transition-all group-hover:w-5"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <p className={columnHeadingClass}>Elsewhere</p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Tooltip key={link.label}>
                    <TooltipTrigger
                      render={
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "group size-9 rounded-lg p-2 transition-all hover:-translate-y-0.5 hover:border-primary",
                            link.color
                          )}
                        />
                      }
                    >
                      <Icon className="size-full transition-transform duration-300 group-hover:scale-110" />
                    </TooltipTrigger>
                    <TooltipContent>{link.label}</TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Malik (velolib)
          </p>
          <FooterSummitButton />
          <p className="font-mono text-muted-foreground/70">
            built with next.js · elev. 0m
          </p>
        </div>
      </div>
    </footer>
  )
}
