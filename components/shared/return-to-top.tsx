"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReturnToTop() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const SCROLL_CONTAINER_ID = "scroll-root"

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const getScroller = () =>
      document.getElementById(SCROLL_CONTAINER_ID) || window

    const onScroll = () => {
      const scroller = getScroller()
      const isWindow = scroller === window

      const scrollTop = isWindow
        ? window.scrollY
        : (scroller as HTMLElement).scrollTop

      const clientHeight = isWindow
        ? window.innerHeight
        : (scroller as HTMLElement).clientHeight

      const threshold = Math.min(
        300,
        Math.max(120, Math.floor(clientHeight * 0.15))
      )
      setVisible(scrollTop > threshold)
    }

    const scroller = getScroller()

    onScroll()

    scroller.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      scroller.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  const handleClick = () => {
    const scroller = document.getElementById(SCROLL_CONTAINER_ID) || window
    if (scroller && "scrollTo" in scroller) {
      scroller.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!mounted) return null

  return (
    <div
      className={cn(
        "fixed top-[calc(var(--nav-height)+1rem)] left-1/2 z-40 -translate-x-1/2 transition-opacity duration-300",
        !visible ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      inert={!visible}
      aria-hidden={!visible}
    >
      <Button
        variant="secondary"
        size="icon"
        onClick={handleClick}
        aria-label="Return to top"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  )
}
