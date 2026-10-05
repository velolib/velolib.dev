"use client"

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import type { SlimReview } from "../../lib/content"
import { ReviewCard } from "./review-card"
import { ReviewFilterChip } from "./review-filter-chip"
import { Button } from "@/components/ui/button"
import { LoadMoreButton } from "@/components/shared/load-more-button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  REVIEW_FILTER_SECTIONS,
  type ReviewFacetKey,
} from "../../lib/review-taxonomy"
import {
  ArrowDownUp,
  ChevronDownIcon,
  Equal,
  EqualApproximately,
  SearchIcon,
  SearchX,
  SlidersHorizontal,
  XIcon,
} from "lucide-react"

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

const RATING_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1)

const FACET_KEYS: ReviewFacetKey[] = REVIEW_FILTER_SECTIONS.flatMap((section) =>
  section.facets.map((facet) => facet.key)
)

type FacetFilters = Record<ReviewFacetKey, string[]>

const EMPTY_FILTERS: FacetFilters = {
  medium: [],
  format: [],
  genre: [],
  status: [],
  quality: [],
  enjoyment: [],
  impact: [],
}

const FACET_OPTIONS = Object.fromEntries(
  REVIEW_FILTER_SECTIONS.flatMap((section) =>
    section.facets.map((facet): [ReviewFacetKey, readonly string[]] => [
      facet.key,
      facet.options,
    ])
  )
) as Record<ReviewFacetKey, readonly string[]>

const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value))

// Search, filters and sort live in the URL, so they survive back/forward
// navigation and can be shared. Defaults are left out to keep it clean.
interface UrlState {
  query: string
  fuzzy: boolean
  filters: FacetFilters
  ratings: number[]
  sortMode: SortMode
  sortOverride: boolean
}

function readUrlState(search: string): UrlState {
  const params = new URLSearchParams(search)
  const readList = (name: string) =>
    (params.get(name) ?? "").split(",").filter(Boolean)

  const query = params.get("q") ?? ""
  const sortParam = params.get("sort")
  const sortMode =
    sortParam && SORT_VALUES.has(sortParam) && sortParam !== "best-match"
      ? (sortParam as SortMode)
      : "curated"

  return {
    query,
    fuzzy: params.get("match") !== "exact",
    filters: Object.fromEntries(
      FACET_KEYS.map((key) => [
        key,
        readList(key).filter((value) => FACET_OPTIONS[key].includes(value)),
      ])
    ) as FacetFilters,
    ratings: readList("rating")
      .map(Number)
      .filter((rating) => RATING_OPTIONS.includes(rating)),
    sortMode,
    sortOverride: query.trim().length > 0 && sortMode === sortParam,
  }
}

function buildUrlSearch(state: UrlState) {
  const encode = (value: string) =>
    encodeURIComponent(value).replace(/%20/g, "+")
  const parts: string[] = []
  const trimmedQuery = state.query.trim()

  if (trimmedQuery) {
    parts.push(`q=${encode(trimmedQuery)}`)
  }

  if (!state.fuzzy) {
    parts.push("match=exact")
  }

  for (const key of FACET_KEYS) {
    if (state.filters[key].length > 0) {
      parts.push(`${key}=${state.filters[key].map(encode).join(",")}`)
    }
  }

  if (state.ratings.length > 0) {
    parts.push(`rating=${[...state.ratings].sort((a, b) => a - b).join(",")}`)
  }

  if (trimmedQuery ? state.sortOverride : state.sortMode !== "curated") {
    parts.push(`sort=${state.sortMode}`)
  }

  return parts.length > 0 ? `?${parts.join("&")}` : ""
}

// How many cards were loaded and how far down the list was scrolled. Kept in
// the history entry itself, so it only comes back on back/forward navigation.
const VIEW_STATE_KEY = "reviewsView"

interface ViewState {
  visibleCount: number
  scrollTop: number
}

function readViewState(): ViewState | null {
  const value = window.history.state?.[VIEW_STATE_KEY]

  return value &&
    typeof value.visibleCount === "number" &&
    typeof value.scrollTop === "number"
    ? value
    : null
}

function writeViewState(viewState: ViewState) {
  window.history.replaceState(
    { ...window.history.state, [VIEW_STATE_KEY]: viewState },
    ""
  )
}

function getFacetValues(
  review: SlimReview["review"],
  key: ReviewFacetKey
): string[] {
  switch (key) {
    case "medium":
      return review.medium ? [review.medium] : []
    case "format":
      return review.formats ?? []
    case "genre":
      return review.genres ?? []
    default:
      return [String(review[key])]
  }
}

// Options within a facet are OR-ed, facets are AND-ed. `skip` leaves one facet
// out so its option counts reflect every other active filter.
function matchesFilters(
  review: SlimReview["review"],
  filters: FacetFilters,
  ratings: number[],
  skip?: ReviewFacetKey | "rating"
) {
  for (const key of FACET_KEYS) {
    const selected = filters[key]

    if (key === skip || selected.length === 0) {
      continue
    }

    if (
      !getFacetValues(review, key).some((value) => selected.includes(value))
    ) {
      return false
    }
  }

  if (
    skip !== "rating" &&
    ratings.length > 0 &&
    !ratings.includes(review.overallRating)
  ) {
    return false
  }

  return true
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

function transformIndexToNumber(
  index: number,
  sortMode: SortMode,
  totalCount: number
) {
  let number = index + 1
  switch (sortMode) {
    case "finish-desc":
      number = totalCount - index
      break
    case "finish-asc":
      number = index + 1
      break
    case "start-desc":
      number = totalCount - index
      break
    case "start-asc":
      number = index + 1
      break
    case "curated":
      number = index + 1
      break
    case "title-asc":
      number = index + 1
      break
    case "best-match":
      number = index + 1
      break
    default:
      number = index + 1
  }
  return number
}

function FacetRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid gap-2 sm:grid-cols-[5.5rem_1fr] sm:items-start"
    >
      <p className="text-xs font-medium text-muted-foreground sm:pt-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
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
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [fuzzyMatchingEnabled, setFuzzyMatchingEnabled] = useState(true)
  const [filters, setFilters] = useState<FacetFilters>(EMPTY_FILTERS)
  const [ratings, setRatings] = useState<number[]>([])
  const [sortMode, setSortMode] = useState<SortMode>("curated")
  const [sortOverrideDuringSearch, setSortOverrideDuringSearch] =
    useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount)
  const [isRestored, setIsRestored] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pendingScrollTopRef = useRef<number | null>(null)
  const visibleCountRef = useRef(visibleCount)

  const resetVisibleCount = () => {
    setVisibleCount(initialVisibleCount)
  }

  // The page scrolls inside <main>, not the window.
  const getScrollContainer = () => rootRef.current?.closest("main") ?? null

  const saveViewState = () => {
    const container = getScrollContainer()

    if (isRestored && container) {
      writeViewState({
        visibleCount: visibleCountRef.current,
        scrollTop: container.scrollTop,
      })
    }
  }

  // Restore from the URL before paint, so going back doesn't flash the
  // unfiltered list. Runs once; the server render always uses the defaults.
  useLayoutEffect(() => {
    const urlState = readUrlState(window.location.search)
    const viewState = readViewState()

    /* eslint-disable react-hooks/set-state-in-effect */
    setQuery(urlState.query)
    setDebouncedQuery(urlState.query)
    setFuzzyMatchingEnabled(urlState.fuzzy)
    setFilters(urlState.filters)
    setRatings(urlState.ratings)
    setSortMode(urlState.sortMode)
    setSortOverrideDuringSearch(urlState.sortOverride)

    if (viewState) {
      setVisibleCount(Math.max(initialVisibleCount, viewState.visibleCount))
      pendingScrollTopRef.current = viewState.scrollTop
    }

    setIsRestored(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialVisibleCount])

  useLayoutEffect(() => {
    if (!isRestored || pendingScrollTopRef.current === null) {
      return
    }

    getScrollContainer()?.scrollTo({
      top: pendingScrollTopRef.current,
      behavior: "instant",
    })
    pendingScrollTopRef.current = null
  }, [isRestored])

  useEffect(() => {
    if (!isRestored) {
      return
    }

    const search = buildUrlSearch({
      query: debouncedQuery,
      fuzzy: fuzzyMatchingEnabled,
      filters,
      ratings,
      sortMode,
      sortOverride: sortOverrideDuringSearch,
    })

    if (search !== window.location.search) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${search}${window.location.hash}`
      )
    }
  }, [
    debouncedQuery,
    filters,
    fuzzyMatchingEnabled,
    isRestored,
    ratings,
    sortMode,
    sortOverrideDuringSearch,
  ])

  useEffect(() => {
    visibleCountRef.current = visibleCount
    saveViewState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, isRestored])

  // Debounced so scrolling doesn't spam the History API; clicks on a card are
  // saved immediately through onClickCapture below.
  useEffect(() => {
    const container = getScrollContainer()

    if (!isRestored || !container) {
      return
    }

    let timeout: number | undefined

    const handleScroll = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(saveViewState, 150)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.clearTimeout(timeout)
      container.removeEventListener("scroll", handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestored])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [query])

  // "/" jumps to the search box, unless the user is already typing somewhere.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const target = event.target as HTMLElement | null

      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return
      }

      event.preventDefault()
      searchInputRef.current?.focus()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const normalizedLiveQuery = normalizeForSearch(query.trim())
  const normalizedQuery = normalizeForSearch(debouncedQuery.trim())
  const effectiveSortMode: SortMode =
    normalizedLiveQuery.length > 0 && !sortOverrideDuringSearch
      ? "best-match"
      : sortMode

  const textMatchedReviews = useMemo(
    () =>
      allReviews
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
              const exactSubstringIndex =
                normalizedTitle.indexOf(normalizedQuery)

              bestTextScore =
                exactSubstringIndex >= 0 ? 1300 - exactSubstringIndex : -1
            }
          }

          return {
            entry,
            bestTextScore,
          }
        })
        .filter(
          ({ bestTextScore }) =>
            normalizedQuery.length === 0 || bestTextScore >= 0
        ),
    [allReviews, fuzzyMatchingEnabled, normalizedQuery]
  )

  const facetCounts = useMemo(() => {
    const counts = Object.fromEntries(
      FACET_KEYS.map((key) => [key, {} as Record<string, number>])
    ) as Record<ReviewFacetKey, Record<string, number>>
    const ratingCounts: Record<number, number> = {}

    for (const { entry } of textMatchedReviews) {
      for (const key of FACET_KEYS) {
        if (!matchesFilters(entry.review, filters, ratings, key)) {
          continue
        }

        for (const value of getFacetValues(entry.review, key)) {
          counts[key][value] = (counts[key][value] ?? 0) + 1
        }
      }

      if (matchesFilters(entry.review, filters, ratings, "rating")) {
        const rating = entry.review.overallRating
        ratingCounts[rating] = (ratingCounts[rating] ?? 0) + 1
      }
    }

    return { counts, ratingCounts }
  }, [filters, ratings, textMatchedReviews])

  const filteredSortedReviews = useMemo(() => {
    const filtered = textMatchedReviews.filter(({ entry }) =>
      matchesFilters(entry.review, filters, ratings)
    )

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
  }, [effectiveSortMode, filters, ratings, textMatchedReviews])

  const visibleReviews = filteredSortedReviews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredSortedReviews.length
  const activeFilters = FACET_KEYS.flatMap((key) =>
    filters[key].map((value) => ({ key, value }))
  )
  const activeFilterCount = activeFilters.length + ratings.length
  const isSearchPending =
    effectiveSortMode === "best-match" &&
    query !== debouncedQuery &&
    query.length > 0

  const toggleFacetValue = (key: ReviewFacetKey, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }))
    resetVisibleCount()
  }

  const toggleRating = (rating: number) => {
    setRatings((current) =>
      current.includes(rating)
        ? current.filter((item) => item !== rating)
        : [...current, rating]
    )
    resetVisibleCount()
  }

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery)

    if (normalizeForSearch(nextQuery.trim()).length === 0) {
      setSortOverrideDuringSearch(false)

      if (sortMode === "best-match") {
        setSortMode("finish-desc")
      }
    }

    resetVisibleCount()
  }

  const clearSearch = () => {
    handleQueryChange("")
    setDebouncedQuery("")
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setRatings([])
    resetVisibleCount()
  }

  const clearAll = () => {
    clearSearch()
    clearFilters()
  }

  const handleLoadMore = () => {
    setVisibleCount((currentVisibleCount) =>
      Math.min(
        currentVisibleCount + LOAD_MORE_COUNT,
        filteredSortedReviews.length
      )
    )
  }

  const ratingRow = (
    <FacetRow label="Rating">
      {RATING_OPTIONS.map((option) => {
        const selected = ratings.includes(option)
        const count = facetCounts.ratingCounts[option] ?? 0

        return (
          <ReviewFilterChip
            key={option}
            type="rating"
            value={option}
            selected={selected}
            count={count}
            disabled={count === 0 && !selected}
            onToggle={() => toggleRating(option)}
          />
        )
      })}
    </FacetRow>
  )

  return (
    <div
      ref={rootRef}
      onClickCapture={saveViewState}
      className="flex min-h-0 flex-1 flex-col gap-6"
    >
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <InputGroup className="h-10 flex-1 bg-background/60 backdrop-blur-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchInputRef}
              id="reviews-search"
              type="search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && query.length > 0) {
                  event.preventDefault()
                  clearSearch()
                }
              }}
              placeholder="Search titles, alt names, short reviews…"
              aria-label="Search reviews"
              className="[&::-webkit-search-cancel-button]:hidden"
            />
            <InputGroupAddon align="inline-end">
              {isSearchPending && <Spinner className="size-4" />}
              {query.length > 0 ? (
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear search"
                  onClick={() => {
                    clearSearch()
                    searchInputRef.current?.focus()
                  }}
                >
                  <XIcon />
                </InputGroupButton>
              ) : (
                <kbd
                  data-slot="kbd"
                  className="hidden h-5 items-center font-sans text-xs sm:inline-flex"
                >
                  /
                </kbd>
              )}
              <InputGroupButton
                variant={fuzzyMatchingEnabled ? "secondary" : "ghost"}
                aria-pressed={fuzzyMatchingEnabled}
                aria-label="Toggle fuzzy matching"
                title={
                  fuzzyMatchingEnabled
                    ? "Fuzzy matching: typos and partial words match"
                    : "Exact matching: title must contain the text"
                }
                onClick={() => {
                  setFuzzyMatchingEnabled((current) => !current)
                  setDebouncedQuery(query)
                  resetVisibleCount()
                }}
                className="w-18 justify-center"
              >
                {fuzzyMatchingEnabled ? <EqualApproximately /> : <Equal />}
                {fuzzyMatchingEnabled ? "Fuzzy" : "Exact"}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <div className="flex gap-3">
            <Select
              value={effectiveSortMode}
              onValueChange={(next) => {
                if (next === "best-match" && normalizedLiveQuery.length === 0) {
                  return
                }

                setSortMode(next as SortMode)

                if (normalizeForSearch(query.trim()).length > 0) {
                  setSortOverrideDuringSearch(true)
                }

                resetVisibleCount()
              }}
            >
              <SelectTrigger
                aria-label="Sort reviews"
                className="h-10! min-w-0 flex-1 bg-background/60 backdrop-blur-sm sm:w-60 sm:flex-none"
              >
                <ArrowDownUp className="text-muted-foreground" />
                <SelectValue className="flex-1 text-left">
                  {(value) => SORT_LABELS[(value as SortMode) ?? "curated"]}
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

            <CollapsibleTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="bg-background/60 backdrop-blur-sm"
                />
              }
            >
              <SlidersHorizontal />
              Filters
              <ChevronDownIcon
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
          </div>
        </div>

        <div className="mt-3 flex min-h-7 flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Active:</span>
          {activeFilterCount === 0 && (
            <span className="text-xs text-muted-foreground/70">None</span>
          )}
          {ratings.map((rating) => (
            <ReviewFilterChip
              key={rating}
              type="rating"
              value={rating}
              selected
              removable
              onToggle={() => toggleRating(rating)}
            />
          ))}
          {activeFilters.map(({ key, value }) => (
            <ReviewFilterChip
              key={`${key}:${value}`}
              type={key}
              value={value}
              selected
              removable
              onToggle={() => toggleFacetValue(key, value)}
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={clearFilters}
            disabled={activeFilterCount === 0}
            className="ml-auto text-muted-foreground"
          >
            Clear all
          </Button>
        </div>

        <CollapsibleContent>
          <div className="mt-4 grid gap-6 rounded-2xl border bg-card/50 p-4 backdrop-blur-sm sm:p-5 lg:grid-cols-2 lg:gap-8">
            {REVIEW_FILTER_SECTIONS.map((section) => (
              <section key={section.label} className="space-y-4">
                <h2 className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                  {section.label}
                </h2>
                {section.label === "Verdict" && ratingRow}
                {section.facets.map((facet) => (
                  <FacetRow key={facet.key} label={facet.label}>
                    {facet.options.map((option) => {
                      const selected = filters[facet.key].includes(option)
                      const count = facetCounts.counts[facet.key][option] ?? 0

                      return (
                        <ReviewFilterChip
                          key={option}
                          type={facet.key}
                          value={option}
                          selected={selected}
                          count={count}
                          disabled={count === 0 && !selected}
                          onToggle={() => toggleFacetValue(facet.key, option)}
                        />
                      )
                    })}
                  </FacetRow>
                ))}
              </section>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filteredSortedReviews.length === allReviews.length
          ? `${allReviews.length} reviews`
          : `${filteredSortedReviews.length} of ${allReviews.length} reviews`}
        {effectiveSortMode === "best-match" && normalizedQuery.length > 0 && (
          <span> · Best match ranking</span>
        )}
      </p>

      <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
        {visibleReviews.map((review, index) => (
          <ReviewCard
            key={review.slug}
            slug={review.slug}
            review={review.review}
            number={transformIndexToNumber(
              index,
              effectiveSortMode,
              filteredSortedReviews.length
            )}
          />
        ))}
      </div>

      {filteredSortedReviews.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-12 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <div className="space-y-1">
            <p className="font-medium">No reviews match</p>
            <p className="text-sm text-muted-foreground">
              Try a different search or remove a filter or two.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            Clear search & filters
          </Button>
        </div>
      )}

      {hasMore && (
        <LoadMoreButton
          onClick={handleLoadMore}
          shown={visibleReviews.length}
          total={filteredSortedReviews.length}
        >
          Load more reviews
        </LoadMoreButton>
      )}
    </div>
  )
}
