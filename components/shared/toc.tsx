"use client"

import { Card } from "@/components/ui/card"

type TocEntry = {
  level: number
  text: string
  slug: string
}

type Node = TocEntry & { children: Node[] }

export default function Toc({ toc }: { toc: TocEntry[] }) {
  const buildTree = (items: TocEntry[]) => {
    const root: Node = { level: 0, text: "root", slug: "", children: [] }
    const parents: Node[] = [root]

    for (const item of items) {
      while (
        parents.length &&
        parents[parents.length - 1].level >= item.level
      ) {
        parents.pop()
      }
      const node: Node = { ...item, children: [] }
      parents[parents.length - 1].children.push(node)
      parents.push(node)
    }

    return root.children
  }

  const tree = buildTree(toc ?? [])

  const renderNodes = (nodes: Node[], level: number = 1) => (
    <ul>
      {nodes.map((node) => {
        const isLevel1 = level === 1
        const isLevel2 = level === 2

        return (
          <li key={node.slug}>
            <a
              href={`#${node.slug}`}
              className={`group flex items-center gap-2 rounded-md py-2 transition-all duration-150 ${
                isLevel1
                  ? "text-sm font-medium"
                  : isLevel2
                    ? "pl-4 text-xs"
                    : "pl-8 text-xs"
              } `}
            >
              <span className="flex-1 truncate group-hover:underline">
                {node.text}
              </span>
            </a>
            {node.children.length > 0 && renderNodes(node.children, level + 1)}
          </li>
        )
      })}
    </ul>
  )

  if (!toc || toc.length === 0) return null

  return (
    <Card className="gap-2 px-6">
      <h2 className="text-lg font-semibold">Table of Contents</h2>
      <nav>{renderNodes(tree)}</nav>
    </Card>
  )
}
