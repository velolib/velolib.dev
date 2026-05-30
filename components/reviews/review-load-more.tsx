"use client"

import { useEffect, useMemo, useState } from "react"

import type { SlimReview } from "../../lib/content"
import { ReviewCard } from "./review-card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxLabel,
  ComboboxSeparator,
  ComboboxValue,
} from "@/components/ui/combobox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Spinner } from "@/components/ui/spinner"
import {
  REVIEW_ASPECT_FILTER_GROUPS,
  REVIEW_MEDIA_FILTER_GROUPS,
  REVIEW_STATUSES,
} from "../../lib/review-taxonomy"
import { ChevronDownIcon, Equal, EqualApproximately } from "lucide-react"

const LOAD_MORE_COUNT = 12
const SEARCH_DEBOUNCE_MS = 500

type SortMode =
  | "best-match"
  | "finish-desc"
  | "finish-asc"
  | "start-desc"
  | "start-asc"
  | "curated"
  | "title-asc"

const SORT_OPTIONS: Array<{ value: SortMode; label: string }> = [
  { value: "best-match", label: "Best match" },
  { value: "curated", label: "Curated ranking" },
  { value: "finish-desc", label: "Finish date (newest first)" },
  { value: "finish-asc", label: "Finish date (oldest first)" },
  { value: "start-desc", label: "Start date (newest first)" },
  { value: "start-asc", label: "Start date (oldest first)" },
  { value: "title-asc", label: "Title (A-Z)" },
]

const SORT_LABELS: Record<SortMode, string> = Object.fromEntries(
  SORT_OPTIONS.map((option) => [option.value, option.label])
) as Record<SortMode, string>

const MIN_RATING_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1)

const MIN_RATING_LABELS: Record<string, string> = {
  all: "All ratings",
  ...Object.fromEntries(
    MIN_RATING_OPTIONS.map((option) => [String(option), `${option}+`])
  ),
}

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
}

function isSubsequenceMatch(query: string, target: string) {
  if (query.length === 0) {
    return true
  }

  let targetIndex = 0

  for (let queryIndex = 0; queryIndex < query.length; queryIndex += 1) {
    const queryChar = query[queryIndex]

    while (targetIndex < target.length && target[targetIndex] !== queryChar) {
      targetIndex += 1
    }

    if (targetIndex === target.length) {
      return false
    }

    targetIndex += 1
  }

  return true
}

function fuzzyIncludes(query: string, target: string) {
  if (query.length === 0) {
    return true
  }

  if (target.includes(query)) {
    return true
  }

  const compactQuery = query.replace(/\s+/g, "")
  const compactTarget = target.replace(/\s+/g, "")

  if (isSubsequenceMatch(compactQuery, compactTarget)) {
    return true
  }

  const queryTokens = query.split(/\s+/).filter(Boolean)
  const targetTokens = target.split(/\s+/).filter(Boolean)

  return queryTokens.every((queryToken) =>
    targetTokens.some(
      (targetToken) =>
        targetToken.includes(queryToken) ||
        isSubsequenceMatch(queryToken, targetToken)
    )
  )
}

function fuzzyScore(query: string, target: string) {
  if (query.length === 0) {
    return 0
  }

  if (!fuzzyIncludes(query, target)) {
    return -1
  }

  if (target === query) {
    return 1400
  }

  const directIndex = target.indexOf(query)

  if (directIndex >= 0) {
    return 1200 - directIndex
  }

  const queryTokens = query.split(/\s+/).filter(Boolean)
  const tokenPositions = queryTokens
    .map((queryToken) => target.indexOf(queryToken))
    .filter((index) => index >= 0)

  if (
    tokenPositions.length === queryTokens.length &&
    tokenPositions.length > 0
  ) {
    const averagePosition =
      tokenPositions.reduce((sum, index) => sum + index, 0) /
      tokenPositions.length

    return 950 - averagePosition
  }

  const compactQuery = query.replace(/\s+/g, "")
  const compactTarget = target.replace(/\s+/g, "")

  if (isSubsequenceMatch(compactQuery, compactTarget)) {
    return 700 - (compactTarget.length - compactQuery.length)
  }

  return 500
}

interface FacetMultiSelectProps {
  label: string
  placeholder: string
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}

function FacetMultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FacetMultiSelectProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
        {label}
      </p>
      <Combobox
        items={options}
        multiple
        value={value}
        onValueChange={(next) => onChange(Array.isArray(next) ? next : [])}
      >
        <ComboboxChips className="w-full">
          <ComboboxValue>
            {value.map((item) => (
              <ComboboxChip key={item}>{item}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>No options found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

interface GroupedFacetMultiSelectProps {
  label: string
  placeholder: string
  groups: ReadonlyArray<{
    label: string
    options: ReadonlyArray<string>
  }>
  value: string[]
  onChange: (next: string[]) => void
}

function GroupedFacetMultiSelect({
  label,
  placeholder,
  groups,
  value,
  onChange,
}: GroupedFacetMultiSelectProps) {
  const options = groups.flatMap((group) =>
    group.options.map((option) => `${group.label.toLowerCase()}:${option}`)
  )
  const optionLabels = Object.fromEntries(
    groups.flatMap((group) =>
      group.options.map((option) => [
        `${group.label.toLowerCase()}:${option}`,
        option,
      ])
    )
  ) as Record<string, string>

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
        {label}
      </p>
      <Combobox
        items={options}
        multiple
        value={value}
        onValueChange={(next) => onChange(Array.isArray(next) ? next : [])}
      >
        <ComboboxChips className="w-full">
          <ComboboxValue>
            {value.map((item) => (
              <ComboboxChip key={item}>
                {optionLabels[item] ?? item}
              </ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>No options found.</ComboboxEmpty>
          <ComboboxList>
            {groups.map((group, groupIndex) => (
              <ComboboxGroup key={group.label}>
                <ComboboxLabel>{group.label}</ComboboxLabel>
                {group.options.map((option) => {
                  const valueKey = `${group.label.toLowerCase()}:${option}`

                  return (
                    <ComboboxItem key={valueKey} value={valueKey}>
                      {option}
                    </ComboboxItem>
                  )
                })}
                {groupIndex < groups.length - 1 && <ComboboxSeparator />}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

interface ReviewLoadMoreProps {
  allReviews: SlimReview[]
  initialVisibleCount: number
}

export function ReviewLoadMore({
  allReviews,
  initialVisibleCount,
}: ReviewLoadMoreProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [fuzzyMatchingEnabled, setFuzzyMatchingEnabled] = useState(true)
  const [selectedMediaFilters, setSelectedMediaFilters] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedAspectFilters, setSelectedAspectFilters] = useState<string[]>(
    []
  )
  const [minimumRating, setMinimumRating] = useState<number | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>("curated")
  const [sortOverrideDuringSearch, setSortOverrideDuringSearch] =
    useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount)

  const resetVisibleCount = () => {
    setVisibleCount(initialVisibleCount)
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [query])

  const normalizedLiveQuery = normalizeForSearch(query.trim())
  const normalizedQuery = normalizeForSearch(debouncedQuery.trim())
  const effectiveSortMode: SortMode =
    normalizedLiveQuery.length > 0 && !sortOverrideDuringSearch
      ? "best-match"
      : sortMode

  const selectedMediums = selectedMediaFilters
    .filter((item) => item.startsWith("medium:"))
    .map((item) => item.replace(/^medium:/, ""))
  const selectedFormats = selectedMediaFilters
    .filter((item) => item.startsWith("format:"))
    .map((item) => item.replace(/^format:/, ""))
  const selectedGenres = selectedMediaFilters
    .filter((item) => item.startsWith("genres:"))
    .map((item) => item.replace(/^genres:/, ""))
  const selectedQualities = selectedAspectFilters
    .filter((item) => item.startsWith("quality:"))
    .map((item) => item.replace(/^quality:/, ""))
  const selectedEnjoyments = selectedAspectFilters
    .filter((item) => item.startsWith("enjoyment:"))
    .map((item) => item.replace(/^enjoyment:/, ""))
  const selectedImpacts = selectedAspectFilters
    .filter((item) => item.startsWith("impact:"))
    .map((item) => item.replace(/^impact:/, ""))

  const filteredSortedReviews = useMemo(() => {
    const filtered = allReviews
      .map((entry) => {
        const normalizedTitle = normalizeForSearch(entry.review.title)
        const normalizedShortReview = normalizeForSearch(
          entry.review.shortReview
        )
        const normalizedAka = (entry.review.aka || []).map((aka) =>
          normalizeForSearch(aka)
        )

        let bestTextScore = 0

        if (normalizedQuery.length > 0) {
          if (fuzzyMatchingEnabled) {
            const titleScore = fuzzyScore(normalizedQuery, normalizedTitle)
            const shortReviewScore = fuzzyScore(
              normalizedQuery,
              normalizedShortReview
            )
            const akaScores = normalizedAka
              .map((aka) => fuzzyScore(normalizedQuery, aka))
              .filter((score) => score >= 0)
            const bestAkaScore =
              akaScores.length > 0 ? Math.max(...akaScores) : -1

            bestTextScore = Math.max(
              titleScore,
              shortReviewScore >= 0 ? shortReviewScore - 120 : -1,
              bestAkaScore >= 0 ? bestAkaScore - 150 : -1
            )
          } else {
            const exactSubstringIndex = normalizedTitle.indexOf(normalizedQuery)

            bestTextScore =
              exactSubstringIndex >= 0 ? 1300 - exactSubstringIndex : -1
          }
        }

        return {
          entry,
          bestTextScore,
        }
      })
      .filter(({ entry, bestTextScore }) => {
        const textMatches = normalizedQuery.length === 0 || bestTextScore >= 0

        if (!textMatches) {
          return false
        }

        if (
          selectedMediums.length > 0 &&
          (!entry.review.medium ||
            !selectedMediums.includes(entry.review.medium))
        ) {
          return false
        }

        if (
          selectedFormats.length > 0 &&
          !(entry.review.formats ?? []).some((format) =>
            selectedFormats.includes(format)
          )
        ) {
          return false
        }

        if (
          selectedGenres.length > 0 &&
          !(entry.review.genres ?? []).some((genre) =>
            selectedGenres.includes(genre)
          )
        ) {
          return false
        }

        if (
          selectedStatuses.length > 0 &&
          !selectedStatuses.includes(entry.review.status)
        ) {
          return false
        }

        if (
          selectedQualities.length > 0 &&
          !selectedQualities.includes(entry.review.quality)
        ) {
          return false
        }

        if (
          selectedEnjoyments.length > 0 &&
          !selectedEnjoyments.includes(entry.review.enjoyment)
        ) {
          return false
        }

        if (
          selectedImpacts.length > 0 &&
          !selectedImpacts.includes(entry.review.impact)
        ) {
          return false
        }

        if (
          minimumRating !== null &&
          entry.review.overallRating < minimumRating
        ) {
          return false
        }

        return true
      })

    return [...filtered]
      .sort((a, b) => {
        if (effectiveSortMode === "best-match") {
          if (b.bestTextScore !== a.bestTextScore) {
            return b.bestTextScore - a.bestTextScore
          }

          return (
            b.entry.review.finishDate.getTime() -
            a.entry.review.finishDate.getTime()
          )
        }

        if (effectiveSortMode === "finish-asc") {
          return (
            a.entry.review.finishDate.getTime() -
            b.entry.review.finishDate.getTime()
          )
        }

        if (effectiveSortMode === "start-desc") {
          return (
            b.entry.review.startDate.getTime() -
            a.entry.review.startDate.getTime()
          )
        }

        if (effectiveSortMode === "start-asc") {
          return (
            a.entry.review.startDate.getTime() -
            b.entry.review.startDate.getTime()
          )
        }

        if (effectiveSortMode === "curated") {
          if (b.entry.review.overallRating !== a.entry.review.overallRating) {
            return b.entry.review.overallRating - a.entry.review.overallRating
          }

          const qualityOrder = [
            "Gem-Gem",
            "Mid-Gem",
            "Slop-Gem",
            "Gem-Mid",
            "Mid-Mid",
            "Slop-Mid",
            "Gem-Slop",
            "Mid-Slop",
            "Slop-Slop",
          ]

          const qa = qualityOrder.indexOf(a.entry.review.quality as string)
          const qb = qualityOrder.indexOf(b.entry.review.quality as string)

          if (qa !== qb) {
            return qa - qb
          }

          const enjoymentOrder = [
            "Loved it",
            "Liked it",
            "Mixed",
            "Meh",
            "Didn't like it",
            "Hated it",
          ]

          const ea = enjoymentOrder.indexOf(a.entry.review.enjoyment as string)
          const eb = enjoymentOrder.indexOf(b.entry.review.enjoyment as string)

          if (ea !== eb) {
            return ea - eb
          }

          const impactOrder = [
            "Lingering",
            "Memorable",
            "Fleeting",
            "Forgettable",
          ]

          const ia = impactOrder.indexOf(a.entry.review.impact as string)
          const ib = impactOrder.indexOf(b.entry.review.impact as string)

          if (ia !== ib) {
            return ia - ib
          }

          return a.entry.review.title.localeCompare(b.entry.review.title)
        }

        if (effectiveSortMode === "title-asc") {
          return a.entry.review.title.localeCompare(b.entry.review.title)
        }

        return (
          b.entry.review.finishDate.getTime() -
          a.entry.review.finishDate.getTime()
        )
      })
      .map(({ entry }) => entry)
  }, [
    allReviews,
    effectiveSortMode,
    fuzzyMatchingEnabled,
    minimumRating,
    normalizedQuery,
    selectedEnjoyments,
    selectedImpacts,
    selectedQualities,
    selectedFormats,
    selectedGenres,
    selectedMediums,
    selectedStatuses,
  ])

  const visibleReviews = filteredSortedReviews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredSortedReviews.length
  const minimumRatingValue =
    minimumRating === null ? "all" : String(minimumRating)
  const activeFilterCount =
    selectedMediaFilters.length +
    selectedStatuses.length +
    selectedAspectFilters.length +
    (minimumRating !== null ? 1 : 0) +
    (fuzzyMatchingEnabled ? 0 : 1)

  const clearFilters = () => {
    setQuery("")
    setDebouncedQuery("")
    setFuzzyMatchingEnabled(true)
    setSelectedMediaFilters([])
    setSelectedStatuses([])
    setSelectedAspectFilters([])
    setMinimumRating(null)
    setSortMode("curated")
    setSortOverrideDuringSearch(false)
    resetVisibleCount()
  }

  const handleLoadMore = () => {
    setVisibleCount((currentVisibleCount) =>
      Math.min(
        currentVisibleCount + LOAD_MORE_COUNT,
        filteredSortedReviews.length
      )
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Filters</h2>
            <p className="text-xs text-muted-foreground">
              {activeFilterCount} active
            </p>
          </div>
          <CollapsibleTrigger
            render={<Button type="button" variant="outline" size="sm" />}
          >
            {showFilters ? "Hide filters" : "Show filters"}
            <ChevronDownIcon
              className={`size-4 transition-transform ${showFilters ? "" : "-rotate-90"}`}
            />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="mt-4 grid w-full gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="mb-2 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                Search
              </p>
              <div className="flex gap-2">
                <ButtonGroup className="flex-1">
                  <Input
                    id="reviews-search"
                    type="search"
                    value={query}
                    onChange={(event) => {
                      const nextQuery = event.target.value
                      const nextNormalizedQuery = normalizeForSearch(
                        nextQuery.trim()
                      )

                      setQuery(nextQuery)

                      if (nextNormalizedQuery.length === 0) {
                        setSortOverrideDuringSearch(false)

                        if (sortMode === "best-match") {
                          setSortMode("finish-desc")
                        }
                      }

                      resetVisibleCount()
                    }}
                    placeholder="Search title or short review"
                  />
                  <Toggle
                    variant="outline"
                    pressed={fuzzyMatchingEnabled}
                    onPressedChange={(nextPressed) => {
                      setFuzzyMatchingEnabled(nextPressed)
                      setDebouncedQuery(query)
                      resetVisibleCount()
                    }}
                    aria-label="Toggle fuzzy matching"
                    className="w-24 justify-start gap-2 px-3"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {fuzzyMatchingEnabled ? (
                        <EqualApproximately className="size-4" />
                      ) : (
                        <Equal className="size-4" />
                      )}
                    </span>
                    <span className="min-w-10 text-center">
                      {fuzzyMatchingEnabled ? "Fuzzy" : "Exact"}
                    </span>
                  </Toggle>
                </ButtonGroup>
              </div>
            </div>

            <div className="lg:col-span-4">
              <p className="mb-2 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                Sort
              </p>
              <Select
                value={effectiveSortMode}
                onValueChange={(next) => {
                  if (
                    next === "best-match" &&
                    normalizedLiveQuery.length === 0
                  ) {
                    return
                  }

                  setSortMode(next as SortMode)

                  if (normalizeForSearch(query.trim()).length > 0) {
                    setSortOverrideDuringSearch(true)
                  }

                  resetVisibleCount()
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value) =>
                      SORT_LABELS[(value as SortMode) ?? "finish-desc"]
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={
                        option.value === "best-match" &&
                        normalizedLiveQuery.length === 0
                      }
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-4">
              <p className="mb-2 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                Minimum rating
              </p>
              <Select
                value={minimumRatingValue}
                onValueChange={(next) => {
                  setMinimumRating(next === "all" ? null : Number(next))
                  resetVisibleCount()
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value) =>
                      MIN_RATING_LABELS[String(value ?? "all")] ?? "All ratings"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  {MIN_RATING_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 lg:col-span-12 xl:grid-cols-3">
              <GroupedFacetMultiSelect
                label="Quality, enjoyment, impact"
                placeholder="Filter quality, enjoyment, or impact"
                groups={REVIEW_ASPECT_FILTER_GROUPS}
                value={selectedAspectFilters}
                onChange={(next) => {
                  setSelectedAspectFilters(next)
                  resetVisibleCount()
                }}
              />
              <GroupedFacetMultiSelect
                label="Medium, format, genres"
                placeholder="Filter medium, format, or genres"
                groups={REVIEW_MEDIA_FILTER_GROUPS}
                value={selectedMediaFilters}
                onChange={(next) => {
                  setSelectedMediaFilters(next)
                  resetVisibleCount()
                }}
              />
              <FacetMultiSelect
                label="Status"
                placeholder="Filter status"
                options={[...REVIEW_STATUSES]}
                value={selectedStatuses}
                onChange={(next) => {
                  setSelectedStatuses(next)
                  resetVisibleCount()
                }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {visibleReviews.length} of {filteredSortedReviews.length}{" "}
            matched reviews ({allReviews.length} total)
            {effectiveSortMode === "best-match" &&
              normalizedQuery.length > 0 && <span> • Best match ranking</span>}
          </p>
          {effectiveSortMode === "best-match" &&
            query !== debouncedQuery &&
            query.length > 0 && <Spinner className="size-4" />}
        </div>
        <Button type="button" variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      </div>

      <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review.slug}
            slug={review.slug}
            review={review.review}
          />
        ))}
      </div>

      {filteredSortedReviews.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No reviews match your current filters.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button type="button" variant="outline" onClick={handleLoadMore}>
            Load more reviews
          </Button>
        </div>
      )}
    </div>
  )
}
