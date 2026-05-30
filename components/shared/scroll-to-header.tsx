"use client"

import { useEffect, useRef } from "react"

interface ScrollToHeaderProps {
  children: React.ReactNode
}

export function ScrollToHeader({ children }: ScrollToHeaderProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  return (
    <header id="post-header" ref={ref}>
      {children}
    </header>
  )
}
