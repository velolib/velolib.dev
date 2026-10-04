"use client"

import { Code, Link2, Share2 } from "lucide-react"
import Image from "next/image"
import axios from "axios"

import { GridData } from "@/lib/grid"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { SectionShell } from "@/components/shared/section-shell"
import { cn } from "@/lib/utils"

interface ShareDialogProps {
  id: string
  gridData: GridData
}

export function ShareDialog({ id, gridData }: ShareDialogProps) {
  const imageUrl = `/api/og/tools/grid/${id}`

  async function handleShareImage() {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "blob",
      })

      const blob = response.data

      const file = new File([blob], `grid-${id}.png`, {
        type: blob.type || "image/png",
      })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Shared Grid",
          text: "Check out my media grid!",
          files: [file],
        })

        toast.success("Image shared.")
        return
      }

      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `grid-${id}.png`

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(objectUrl)

      toast.success("Image downloaded.")
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Unable to share image.")
      }
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Share link copied.")
  }

  async function copyGridData() {
    await navigator.clipboard.writeText(JSON.stringify(gridData, null, 2))
    toast.success("Grid data copied.")
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="btn-brand group relative border-transparent hover:bg-sky-300/10"
          >
            <Share2 className="text-sky-600 dark:text-sky-300" />
            Share
          </Button>
        }
      />

      <DialogContent className="flex max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden p-0">
        <SectionShell
          title="Share grid"
          description="Download the image, share a link, or copy the underlying grid data."
          eyebrow="Share"
          id="share-dialog"
          className="flex min-h-0 flex-1 flex-col"
          compact
        >
          <div
            className={cn(
              "image-ring relative mx-auto w-full overflow-hidden rounded-2xl bg-muted shadow-[0_30px_80px_rgb(56_189_248/0.18)]",
              gridData.isSquare ? "max-w-md" : "max-w-xs"
            )}
          >
            <Image
              unoptimized
              src={imageUrl}
              alt="Grid preview"
              width={1080}
              height={gridData.isSquare ? 1080 : 1620}
              className={cn(
                "block w-full object-cover",
                gridData.isSquare ? "aspect-square" : "aspect-2/3"
              )}
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleShareImage}
              size="lg"
              variant="outline"
              className="btn-brand group relative w-full border-transparent hover:bg-sky-300/10"
            >
              <Share2 className="text-sky-600 dark:text-sky-300" />
              Share image
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={copyLink}>
                <Link2 />
                Copy link
              </Button>
              <Button variant="outline" onClick={copyGridData}>
                <Code />
                Copy grid data
              </Button>
            </div>
          </div>
        </SectionShell>
      </DialogContent>
    </Dialog>
  )
}
