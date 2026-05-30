import type { MDXComponents } from "mdx/types"

import type { SlimReview } from "@/lib/content"

import { ReviewLink } from "./review-link"
import { SpotifyEmbed } from "./review-spotify-embed"
import GithubSlugger from "github-slugger"
import React from "react"
import Link from "next/link"

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

  const heading = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    const Comp: React.FC<
      React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
    > = ({ children, ...rest }) => {
      const text = getTextFromChildren(children).trim()
      const id = text ? slugger.slug(text) : undefined
      const level = parseInt(Tag.slice(1), 10) || 1
      const hashes = "#".repeat(level)

      return React.createElement(
        Tag,
        { id, className: "", ...rest },
        <>
          <span className="text-brand font-extrabold">{hashes}</span>
          &nbsp;
          {children}
        </>
      )
    }

    ;(Comp as { displayName?: string }).displayName = `MDX-${Tag.toUpperCase()}`
    return Comp
  }

  return {
    h1: heading("h1"),
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
