import type { MDXComponents } from "mdx/types"

import type { SlimReview } from "@/lib/content"

import { ReviewLink } from "./review-link"
import { SpotifyEmbed } from "./review-spotify-embed"
import GithubSlugger from "github-slugger"
import React from "react"
import Link from "next/link"
import { Link as LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function getTextFromChildren(children: React.ReactNode): string {
  let text = ""
  React.Children.forEach(children, (child) => {
    if (child == null) return
    if (typeof child === "string" || typeof child === "number") {
      text += String(child)
    } else if (React.isValidElement(child)) {
      const el = child as React.ReactElement
      text += getTextFromChildren(
        (el.props as { children?: React.ReactNode }).children
      )
    }
  })
  return text
}

export function createMdxComponents(): MDXComponents {
  const slugger = new GithubSlugger()

  const heading = (Tag: "h2" | "h3" | "h4" | "h5" | "h6") => {
    const Comp: React.FC<
      React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
    > = ({ children, className, ...rest }) => {
      const text = getTextFromChildren(children).trim()
      const id = text ? slugger.slug(text) : undefined

      const title = (
        <span className="min-w-0">
          {children}
          {id && (
            <span className="not-prose">
              <a
                href={`#${id}`}
                aria-label={`Link to section: ${text}`}
                className="ml-2 inline-flex align-middle text-sky-600 no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 dark:text-sky-300"
              >
                <LinkIcon aria-hidden className="size-[0.6em]" />
              </a>
            </span>
          )}
        </span>
      )

      if (Tag === "h2") {
        return (
          <h2
            id={id}
            className={cn("group flex flex-col gap-3", className)}
            {...rest}
          >
            {title}
            <span
              aria-hidden
              className="h-0.5 rounded-full bg-linear-to-r from-sky-300 via-sea-300/60 to-transparent"
            />
          </h2>
        )
      }

      if (Tag === "h3") {
        return (
          <h3
            id={id}
            className={cn("group flex items-start gap-3", className)}
            {...rest}
          >
            <span aria-hidden className="flex h-lh shrink-0 items-center">
              <span className="size-2 rotate-45 rounded-xs bg-linear-to-br from-sky-300 to-sea-300" />
            </span>
            {title}
          </h3>
        )
      }

      return React.createElement(
        Tag,
        { id, className: cn("group", className), ...rest },
        title
      )
    }

    ;(Comp as { displayName?: string }).displayName = `MDX-${Tag.toUpperCase()}`
    return Comp
  }

  return {
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),
    a: ({ href, ...props }) => <Link href={href ?? "#"} {...props} />,
    SpotifyEmbed: SpotifyEmbed,
  }
}

type ReviewLookup = Record<string, SlimReview>

function getReviewFromHref(href?: string, reviewLookup?: ReviewLookup) {
  const slug = href?.match(/^\/reviews\/([^/?#]+)\/?(?:[?#].*)?$/)?.[1]

  if (!slug || !reviewLookup) {
    return undefined
  }

  return reviewLookup[slug]
}

export function createReviewMdxComponents(
  reviewLookup: ReviewLookup
): MDXComponents {
  const base = createMdxComponents()
  return {
    ...base,
    a: ({ href, ...props }) => (
      <ReviewLink
        href={href}
        review={getReviewFromHref(href, reviewLookup)}
        {...props}
      />
    ),
  }
}
