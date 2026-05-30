import type { MDXComponents } from "mdx/types"

import { createMdxComponents } from "@/components/mdx/mdx-components"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const base = createMdxComponents()
  return {
    ...base,
    ...components,
  }
}
