"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  SiDiscord,
  SiX,
  SiGithub,
  SiInstagram,
  SiGmail,
  SiSpotify,
} from "@icons-pack/react-simple-icons"
import GradientBackground from "./gradient-background"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

const names = ["velo", "veloLib", "velocitize"]

export function Hero() {
  const [currentNameIndex, setCurrentNameIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % names.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/velolib",
      icon: SiGithub,
      color:
        "text-[#181717] dark:text-white hover:text-[#181717] dark:hover:text-white",
    },
    {
      label: "X",
      href: "https://x.com/vlocitize",
      icon: SiX,
      color:
        "text-black dark:text-white hover:text-black dark:hover:text-white",
    },
    {
      label: "Discord",
      href: "https://discord.com/users/689289283286466573",
      icon: SiDiscord,
      color: "text-[#5865F2] hover:text-[#5865F2]/80",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/vlocitize",
      icon: SiInstagram,
      color: "text-[#FF0069] hover:text-[#FF0069]/80",
    },
    {
      label: "Email",
      href: "mailto:vlocitize@gmail.com",
      icon: SiGmail,
      color: "text-[#EA4335] hover:text-[#EA4335]/80",
    },
    {
      label: "Spotify",
      href: "https://open.spotify.com/user/le2sdqta7f8158vtb62wc1nve",
      icon: SiSpotify,
      color: "text-[#1ED760] hover:text-[#1ED760]/80",
    },
  ]

  return (
    <section
      id="home"
      className="relative flex h-[calc(100dvh-var(--nav-height))] snap-start snap-always items-center justify-center overflow-hidden px-4"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      <div className="relative z-10 flex max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-8 space-y-4">
          <motion.p
            className="text-lg font-medium tracking-wide text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hi, I&apos;m
          </motion.p>

          <div className="relative h-20 overflow-hidden md:h-28">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={names[currentNameIndex]}
                className="text-brand font-serif text-4xl font-bold md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {names[currentNameIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">
            Also known as{" "}
            <span className="font-semibold text-foreground">Malik</span>
            <br />a software developer from{" "}
            <span className="font-semibold text-foreground">
              Jakarta, Indonesia
            </span>
          </p>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A passionate builder who loves creating things that make a
            difference
          </p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground/80 md:text-base">
            This is where I showcase every significant thing I&apos;ve made
            online
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {socialLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "group relative size-16 p-4.5",
                  link.color
                )}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                }}
              >
                <Icon className="size-full transition-transform duration-300 group-hover:scale-125" />
                <span className="absolute -bottom-9 hidden px-2 py-1 text-xs whitespace-nowrap text-foreground group-hover:block md:block">
                  {link.label}
                </span>
              </motion.a>
            )
          })}
        </motion.div>
      </div>

      <GradientBackground />
    </section>
  )
}
