"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type TocEntry = {
  level: number
  text: string
  slug: string
}

type Node = TocEntry & { children: Node[] }

const SCROLL_CONTAINER_ID = "scroll-root"

function buildTree(items: TocEntry[]) {
  const root: Node = { level: 0, text: "root", slug: "", children: [] }
  const parents: Node[] = [root]

  for (const item of items) {
    while (parents.length && parents[parents.length - 1].level >= item.level) {
      parents.pop()
    }
    const node: Node = { ...item, children: [] }
    parents[parents.length - 1].children.push(node)
    parents.push(node)
  }

  return root.children
}

function useActiveSlug(toc: TocEntry[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const root = document.getElementById(SCROLL_CONTAINER_ID)
    const headings = toc
      .map((entry) => document.getElementById(entry.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const update = () => {
      const top = root ? root.getBoundingClientRect().top : 0
      const height = root ? root.clientHeight : window.innerHeight
      const line = top + height / 3
      let current: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id
        else break
      }
      setActive(current)
    }

    const scroller = root ?? window
    update()
    scroller.addEventListener("scroll", update, { passive: true })
    return () => scroller.removeEventListener("scroll", update)
  }, [toc])

  return active
}

function TocList({
  nodes,
  active,
  depth = 0,
}: {
  nodes: Node[]
  active: string | null
  depth?: number
}) {
  return (
    <ul className={cn(depth === 0 && "relative space-y-0.5")}>
      {depth === 0 && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[linear-gradient(to_bottom,transparent,var(--color-sky-300)_30%,var(--color-sea-300)_70%,transparent)] opacity-80"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-[10%] -left-1 w-2 bg-[linear-gradient(to_bottom,transparent,var(--color-sky-300)_30%,var(--color-sea-300)_70%,transparent)] opacity-30 blur-md"
          />
        </>
      )}
      {nodes.map((node) => {
        const isActive = node.slug === active
        return (
          <li key={node.slug}>
            <a
              href={`#${node.slug}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative block rounded-md py-1.5 pr-2 text-muted-foreground transition-colors hover:text-foreground",
                depth === 0
                  ? "pl-4 text-sm"
                  : depth === 1
                    ? "pl-7 text-xs"
                    : "pl-10 text-xs",
                isActive &&
                  "bg-sky-500/10 font-medium text-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-sky-300 before:to-sea-300"
              )}
            >
              <span className="line-clamp-2">{node.text}</span>
            </a>
            {node.children.length > 0 && (
              <TocList
                nodes={node.children}
                active={active}
                depth={depth + 1}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

const LABEL =
  "text-xs font-medium tracking-[0.28em] text-sky-600 uppercase dark:text-sky-300"

export default function Toc({
  toc,
  variant = "sidebar",
}: {
  toc: TocEntry[]
  variant?: "sidebar" | "collapsible"
}) {
  const active = useActiveSlug(toc)
  if (!toc || toc.length === 0) return null
  const tree = buildTree(toc)

  if (variant === "collapsible") {
    return (
      <details className="group rounded-2xl border bg-card/60 backdrop-blur-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
          <span className={LABEL}>On this page</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label="Table of contents" className="px-5 pb-4">
          <TocList nodes={tree} active={active} />
        </nav>
      </details>
    )
  }

  return (
    <nav aria-label="Table of contents" className="space-y-3">
      <p className={LABEL}>On this page</p>
      <TocList nodes={tree} active={active} />
    </nav>
  )
}
