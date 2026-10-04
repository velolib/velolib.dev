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
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Film, Search, Tv } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaData) => void
  slotIndex: number
}

const typeOptions = [
  { value: "tv", label: "TV shows", icon: Tv },
  { value: "movie", label: "Movies", icon: Film },
] as const

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
      setError("")
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
          eyebrow={`Slot ${String(slotIndex + 1).padStart(2, "0")}`}
          title="Search media"
          description="Find a show or film on TMDB and drop it into your grid."
          className="flex min-h-0 flex-1 flex-col"
          compact
        >
          <div className="flex min-h-0 flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonGroup aria-label="Media type" className="shrink-0">
                {typeOptions.map(({ value, label, icon: Icon }) => {
                  const active = value === selectedType
                  return (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      aria-pressed={active}
                      onClick={() => setSelectedType(value)}
                      className={cn(
                        active &&
                          "bg-sky-500/10 text-sky-700 hover:bg-sky-500/15 dark:bg-sky-500/15 dark:text-sky-300"
                      )}
                    >
                      <Icon />
                      {label}
                    </Button>
                  )
                })}
              </ButtonGroup>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.currentTarget.value)
                  }}
                  placeholder={`Search ${typeOptions.find((option) => option.value === selectedType)?.label.toLowerCase()}...`}
                  aria-label="Search media"
                  className="w-full pl-9"
                  autoFocus
                />
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm text-destructive"
              >
                {error}
              </p>
            )}
            {loading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <Spinner className="size-6 text-sky-600 dark:text-sky-300" />
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
                <span className="flex size-12 items-center justify-center rounded-full border bg-background/60 text-sky-600 dark:text-sky-300">
                  <Search className="size-5" />
                </span>
                <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                  {query ? "No media found" : "Start typing to search"}
                </p>
              </div>
            ) : (
              <div className="relative flex min-h-0 flex-1">
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-2 gap-4 p-1 sm:grid-cols-3">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSelect(result)}
                        className="group relative aspect-2/3 overflow-hidden rounded-2xl bg-muted text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        <Image
                          unoptimized
                          sizes="(max-width: 640px) 50vw, 240px"
                          fill
                          priority={false}
                          src={result.posterPath || "/images/placeholder.webp"}
                          alt={result.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.webp"
                          }}
                        />
                        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/85 to-transparent to-60%">
                          <div className="w-full space-y-1 p-3">
                            <p className="line-clamp-2 font-serif text-sm leading-snug font-bold text-balance text-white">
                              {result.name}
                            </p>
                            {result.year && (
                              <p className="font-mono text-xs text-white/70">
                                {result.year}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          aria-hidden
                          className="card-hover-ring pointer-events-none absolute inset-0 rounded-2xl"
                        />
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
