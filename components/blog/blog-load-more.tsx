"use client"

import { useState, useTransition } from "react"

import { loadMorePosts } from "@/app/actions"
import type { SlimPost } from "../../lib/content"
import { BlogCard } from "./blog-card"
import { LoadMoreButton } from "@/components/shared/load-more-button"

const LOAD_MORE_COUNT = 4

interface BlogLoadMoreProps {
  initialPosts: SlimPost[]
  totalPosts: number
}

export function BlogLoadMore({ initialPosts, totalPosts }: BlogLoadMoreProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [isPending, startTransition] = useTransition()

  const hasMore = posts.length < totalPosts

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextPosts = await loadMorePosts(posts.length, LOAD_MORE_COUNT)

      setPosts((currentPosts) => [...currentPosts, ...nextPosts])
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} slug={post.slug} post={post.post} />
        ))}
      </div>

      {hasMore && (
        <LoadMoreButton
          onClick={handleLoadMore}
          pending={isPending}
          shown={posts.length}
          total={totalPosts}
        >
          {isPending ? "Loading more posts" : "Load more posts"}
        </LoadMoreButton>
      )}
    </div>
  )
}
