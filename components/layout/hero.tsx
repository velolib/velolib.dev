"use client"

import { motion, useReducedMotion } from "motion/react"
import {
  Award,
  Code,
  GraduationCap,
  House,
  MapPin,
  Pickaxe,
} from "lucide-react"
import GradientBackground from "./gradient-background"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { socialLinks } from "@/lib/social-links"

const names = ["velo", "veloLib", "velocitize"]
const HOLD_SECONDS = 2.2
const SPIN_SECONDS = 0.35
const SPIN_EASE = [0.5, 0, 0.2, 1.25] as const

// Slot-machine reel: hold on each name, then snap quickly to the next.
// The list is doubled, so -50% lands back on the first name for a seamless loop.
const CYCLE_SECONDS = names.length * (HOLD_SECONDS + SPIN_SECONDS)
const reel = names.reduce(
  (acc, _, i) => {
    const y = `${(-50 / names.length) * i}%`
    const start = i * (HOLD_SECONDS + SPIN_SECONDS)
    acc.y.push(y, y)
    acc.times.push(
      start / CYCLE_SECONDS,
      (start + HOLD_SECONDS) / CYCLE_SECONDS
    )
    acc.ease.push("linear", SPIN_EASE)
    return acc
  },
  {
    y: [] as string[],
    times: [] as number[],
    ease: [] as ("linear" | typeof SPIN_EASE)[],
  }
)
reel.y.push("-50%")
reel.times.push(1)
// Each name gets a slot as tall as the window, so a resting name sits fully
// inside the clear middle band; only the edges blur and fade while spinning.
const FEATHER_MASK =
  "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)"
const SHARP_MASK =
  "linear-gradient(to bottom, transparent 8%, black 22%, black 78%, transparent 92%)"
const BLURRED_MASK =
  "linear-gradient(to bottom, black 8%, transparent 22%, transparent 78%, black 92%)"

const roles = [
  {
    label: "Web Developer",
    icon: Code,
    tone: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  {
    label: "Minecraft Modder",
    icon: Pickaxe,
    tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    label: "Shenzhen, China",
    icon: MapPin,
    tone: "border-border/70 bg-muted/40 text-foreground",
  },
  {
    label: "From Jakarta, Indonesia",
    icon: House,
    tone: "border-border/70 bg-muted/40 text-muted-foreground",
  },
]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export interface HeroProps {
  counts: {
    blog: number
    reviews: number
    projects: number
  }
}

export function Hero({ counts }: HeroProps) {
  const reduceMotion = useReducedMotion()

  const stats = [
    { id: "blog", label: "Posts", value: counts.blog },
    { id: "reviews", label: "Reviews", value: counts.reviews },
    { id: "projects", label: "Projects", value: counts.projects },
  ]

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100dvh-var(--nav-height))] snap-start snap-always items-center overflow-x-hidden py-10"
    >
      <div className="relative z-10 container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:px-8">
        <div className="space-y-6">
          <motion.p
            className="text-sm font-medium tracking-[0.32em] text-muted-foreground uppercase"
            {...fadeUp(0.1)}
          >
            Hi, I&apos;m
          </motion.p>

          <h1 className="sr-only">{names.join(", ")}</h1>
          <div
            aria-hidden
            className="relative h-[1.6em] overflow-hidden font-serif text-6xl font-bold tracking-tight md:text-7xl xl:text-8xl"
            style={{ maskImage: FEATHER_MASK, WebkitMaskImage: FEATHER_MASK }}
          >
            {[
              { mask: SHARP_MASK, className: "" },
              {
                mask: BLURRED_MASK,
                className: "absolute inset-x-0 top-0 blur-[3px]",
              },
            ].map(({ mask, className }, layer) => (
              <div
                key={layer}
                className={cn("h-full", className)}
                style={{ maskImage: mask, WebkitMaskImage: mask }}
              >
                <motion.div
                  className="flex flex-col"
                  animate={reduceMotion ? undefined : { y: reel.y }}
                  transition={{
                    duration: CYCLE_SECONDS,
                    times: reel.times,
                    ease: reel.ease,
                    repeat: Infinity,
                  }}
                >
                  {[...names, ...names].map((name, index) => (
                    <span
                      key={index}
                      className="text-brand w-fit leading-[1.6]"
                    >
                      {name}
                    </span>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          <motion.p
            className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8"
            {...fadeUp(0.25)}
          >
            Also known as{" "}
            <span className="font-semibold text-foreground">Malik</span>. A
            software developer and passionate builder who loves creating things
            that make a difference.
          </motion.p>

          <motion.div className="flex flex-wrap gap-2" {...fadeUp(0.35)}>
            {roles.map(({ label, icon: Icon, tone }) => (
              <Badge
                key={label}
                variant="outline"
                className={cn("h-7 px-3 text-sm", tone)}
              >
                <Icon />
                {label}
              </Badge>
            ))}
          </motion.div>

          <motion.div className="flex flex-wrap gap-3 pt-2" {...fadeUp(0.45)}>
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
                          "group size-11 rounded-xl p-2.5 transition-all hover:-translate-y-0.5 hover:border-primary",
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
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.3)}>
          <Card className="gap-0 py-0 shadow-xl shadow-sky-300/5">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                Accolades
              </p>
              <span className="size-2 rounded-full bg-linear-to-r from-sky-300 to-sea-300" />
            </div>

            <div className="space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 p-5">
                <div className="bg-mesh absolute inset-0 opacity-15" />
                <div className="relative flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <Award className="size-6" />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                      Scholarship
                    </p>
                    <p className="font-serif text-xl leading-tight font-bold md:text-2xl">
                      Beasiswa Garuda
                    </p>
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                    >
                      Awardee
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border p-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300">
                  <GraduationCap className="size-6" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                    Currently Studying
                  </p>
                  <p className="font-serif text-xl leading-tight font-bold md:text-2xl">
                    Computer Science
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Harbin Institute of Technology, Shenzhen
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 divide-x">
              {stats.map((stat) => (
                <a
                  key={stat.id}
                  href={`#${stat.id}`}
                  className="group flex flex-col items-center gap-1 px-2 py-5 transition-colors hover:bg-muted/50"
                >
                  <span className="text-brand font-serif text-3xl font-bold">
                    {stat.value}
                  </span>
                  <span className="text-[0.65rem] font-medium tracking-[0.28em] text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                    {stat.label}
                  </span>
                </a>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <GradientBackground />
    </section>
  )
}
