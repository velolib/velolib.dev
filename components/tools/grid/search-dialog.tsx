"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { MediaSearchResult, MediaData } from "@/lib/grid"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SectionShell } from "@/components/shared/section-shell"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@uidotdev/usehooks"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from "next/image"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaData) => void
  slotIndex: number
}

const typeOptions = [
  {
    value: "movie",
    label: "Movie",
    description: "Search movies from TMDB",
  },
  {
    value: "tv",
    label: "TV Show",
    description: "Search TV shows from TMDB",
  },
]

export function SearchDialog({
  isOpen,
  onClose,
  onSelect,
  slotIndex,
}: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<MediaSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] =
    useState<(typeof typeOptions)[number]["value"]>("tv")

  useEffect(() => {
    const handleSearchDebounced = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setResults([])
        setError("")
        return
      }
      setLoading(true)
      try {
        const response = await axios.get("/api/tools/grid/search", {
          params: { q: debouncedQuery, type: selectedType },
        })
        setResults(response.data.results || [])
      } catch (err) {
        setError("Failed to search media")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    handleSearchDebounced()
  }, [debouncedQuery, selectedType])

  const handleSelect = (result: MediaSearchResult) => {
    const show: MediaData = {
      id: result.id,
      title: result.name,
      posterUrl: result.posterPath,
      label: "",
      type: selectedType,
    }
    onSelect(show)
    setQuery("")
    setResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[90svh] max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden p-0">
        <SectionShell
          id={`search-dialog-${slotIndex}`}
          eyebrow="Search"
          title="Search media"
          description="Search for your media and add them to your grid."
          className="flex min-h-0 flex-1 flex-col"
          compact
        >
          <div className="flex min-h-0 flex-1 flex-col gap-6">
            <Combobox
              items={typeOptions}
              value={typeOptions.find((item) => item.value === selectedType)}
              onValueChange={(item) => {
                if (item) {
                  setSelectedType(item.value)
                }
              }}
              itemToStringValue={(item) => item.label}
            >
              <ComboboxInput placeholder="Select media type..." />

              <ComboboxContent>
                <ComboboxEmpty>No media types found.</ComboboxEmpty>

                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      <Item size="xs" className="p-0">
                        <ItemContent>
                          <ItemTitle>{item.label}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value)
              }}
              placeholder="Search..."
              className="w-full"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : results.length === 0 && query ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No media found</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Start typing to search
                </p>
              </div>
            ) : (
              <div className="relative flex min-h-0 flex-1">
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="group relative aspect-2/3 overflow-hidden rounded-lg transition-all"
                      >
                        <Image
                          unoptimized
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          fill
                          priority={false}
                          src={result.posterPath || "/images/placeholder.webp"}
                          alt={result.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.webp"
                          }}
                        />
                        {/* Text overlay */}
                        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 to-transparent">
                          <div className="w-full p-2">
                            <p className="line-clamp-2 text-sm font-semibold text-white">
                              {result.name}
                            </p>
                            {result.year && (
                              <p className="mt-1 text-xs text-slate-300">
                                {result.year}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            )}
          </div>
        </SectionShell>
      </DialogContent>
    </Dialog>
  )
}
