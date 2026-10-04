"use client"

import GradientBackground from "@/components/layout/gradient-background"
import { MediaCard } from "@/components/tools/grid/media-card"
import { SearchDialog } from "@/components/tools/grid/search-dialog"
import { SectionShell } from "@/components/shared/section-shell"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { GridData, MediaData } from "@/lib/grid"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Share2 } from "lucide-react"

const INITIAL_GRID: (MediaData | null)[] = Array(9).fill(null)

export function GridMaker() {
  const [medias, setMedias] = useState<(MediaData | null)[]>(INITIAL_GRID)
  const [showTitles, setShowTitles] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [isSquare, setIsSquare] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const filledCount = medias.filter((media) => media !== null).length

  const OPTIONS = [
    {
      id: "showTitles",
      title: "Show titles",
      description: "Print each title over its poster.",
      checked: showTitles,
      onChange: setShowTitles,
    },
    {
      id: "showLabels",
      title: "Show labels",
      description: "Add your own short note under each title.",
      checked: showLabels,
      onChange: setShowLabels,
    },
    {
      id: "isSquare",
      title: "Square tiles",
      description: "Crop posters to squares instead of 2:3.",
      checked: isSquare,
      onChange: setIsSquare,
    },
  ]

  const handleSelectMedia = useCallback((slot: number, show: MediaData) => {
    setMedias((prev) => {
      const updated = [...prev]
      updated[slot] = show
      return updated
    })
    setSelectedSlot(null)
  }, [])

  const handleRemoveMedia = useCallback((slot: number) => {
    setMedias((prev) => {
      const updated = [...prev]
      updated[slot] = null
      return updated
    })
  }, [])

  const handleUpdateLabel = useCallback((slot: number, label: string) => {
    setMedias((prev) => {
      const updated = [...prev]
      if (updated[slot]) {
        updated[slot] = { ...updated[slot]!, label }
      }
      return updated
    })
  }, [])

  const handleShare = async () => {
    if (filledCount === 0) {
      setError("Add at least one media to share")
      return
    }

    setSharing(true)
    setError("")

    try {
      const gridData: GridData = {
        medias: medias,
        showTitles,
        showLabels,
        isSquare,
        createdAt: Date.now(),
      }

      const response = await axios.post("/api/tools/grid/share", gridData)
      const { shareId } = response.data

      router.push(`/tools/grid/${shareId}`)
    } catch (err) {
      setError("Failed to create share")
      console.error(err)
    } finally {
      setSharing(false)
    }
  }

  return (
    <>
      <SectionShell
        id="media-grid"
        eyebrow="Tools"
        title="Media grid"
        description="Create a 3×3 grid of your favorite media and share it with others."
      >
        <GradientBackground />
        <div className="flex flex-col gap-4 rounded-3xl border bg-card/60 p-4 backdrop-blur-sm sm:p-5">
          <p className="text-xs font-medium tracking-[0.28em] text-sky-600 uppercase dark:text-sky-300">
            Options
          </p>
          <FieldGroup className="grid gap-3 md:grid-cols-3">
            {OPTIONS.map(({ id, title, description, checked, onChange }) => (
              <FieldLabel
                key={id}
                htmlFor={id}
                className="rounded-2xl! transition-colors hover:border-sky-300/50 has-data-checked:border-sky-300/50 has-data-checked:bg-sky-500/5 dark:has-data-checked:border-sky-300/30 dark:has-data-checked:bg-sky-500/10"
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    <FieldDescription>{description}</FieldDescription>
                  </FieldContent>
                  <Switch
                    id={id}
                    checked={checked}
                    onCheckedChange={onChange}
                    className="data-checked:bg-linear-to-r data-checked:from-sky-300 data-checked:to-sea-300"
                  />
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-muted-foreground">
              {filledCount} / {medias.length} slots filled
            </p>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm text-destructive sm:mr-auto sm:ml-4"
              >
                {error}
              </p>
            )}
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={filledCount === 0 || sharing}
              className="btn-brand group relative border-transparent hover:bg-sky-300/10"
            >
              {sharing ? (
                <Spinner className="text-sky-600 dark:text-sky-300" />
              ) : (
                <Share2 className="text-sky-600 dark:text-sky-300" />
              )}
              {sharing ? "Creating share" : "Share grid"}
            </Button>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="grid min-w-200 grid-cols-3 gap-4 pb-3 sm:min-w-300 lg:min-w-full lg:gap-6">
            {medias.map((media, idx) => (
              <MediaCard
                key={idx}
                index={idx}
                media={media}
                showTitle={showTitles}
                showLabel={showLabels}
                editable={true}
                onClick={() => setSelectedSlot(idx)}
                onRemove={() => handleRemoveMedia(idx)}
                onEditLabel={(label) => handleUpdateLabel(idx, label)}
                isSquare={isSquare}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <SearchDialog
          isOpen={selectedSlot !== null}
          onClose={() => setSelectedSlot(null)}
          onSelect={(media) => handleSelectMedia(selectedSlot!, media)}
          slotIndex={selectedSlot || 0}
        />
      </SectionShell>
    </>
  )
}
