import { notFound } from "next/navigation"
import { Clock, Hash } from "lucide-react"
import { getSharedGrid } from "@/lib/grid"
import { SectionShell } from "@/components/shared/section-shell"
import { GridData } from "@/lib/grid"
import { ReadonlyMediaCard } from "@/components/tools/grid/readonly-media-card"
import { ShareDialog } from "@/components/tools/grid/share-dialog"
import type { Metadata } from "next"
import GradientBackground from "@/components/layout/gradient-background"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { buildPageMetadata } from "@/lib/seo"
import { PageScroller } from "@/components/layout/page-scroller"

interface SharePageProps {
  params: Promise<{ id: string }>
}

const DESCRIPTION = "A 3×3 media grid made with the velolib.dev grid tool."

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params

  const sharedGrid = await getSharedGrid(id)

  if (!sharedGrid) {
    notFound()
  }

  const gridData = JSON.parse(sharedGrid.data) as GridData

  const meta = [
    { icon: Hash, label: id },
    {
      icon: Clock,
      label: `Expires ${new Date(sharedGrid.expires_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`,
    },
  ]

  return (
    <PageScroller>
      <SectionShell
        id="share"
        eyebrow="Media grid"
        title="Shared grid"
        description={DESCRIPTION}
        buttonText="Make your own"
        buttonHref="/tools/grid"
      >
        <GradientBackground />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {meta.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-3.5 text-sky-600 dark:text-sky-300" />
                {label}
              </li>
            ))}
          </ul>
          <ShareDialog id={id} gridData={gridData} />
        </div>
        <ScrollArea className="w-full">
          <div className="grid min-w-200 grid-cols-3 gap-4 pb-3 sm:min-w-300 lg:min-w-full lg:gap-6">
            {gridData.medias.map((media, index) =>
              media ? (
                <ReadonlyMediaCard
                  key={index}
                  index={index}
                  id={media.id}
                  type={media.type}
                  title={gridData.showTitles ? media.title : undefined}
                  posterUrl={media.posterUrl}
                  label={gridData.showLabels ? media.label : undefined}
                  showTitle={gridData.showTitles}
                  showLabel={gridData.showLabels}
                  isSquare={gridData.isSquare}
                />
              ) : (
                <ReadonlyMediaCard
                  key={index}
                  index={index}
                  isSquare={gridData.isSquare}
                />
              )
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SectionShell>
    </PageScroller>
  )
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { id } = await params

  const sharedGrid = await getSharedGrid(id)

  const gridData = sharedGrid ? (JSON.parse(sharedGrid.data) as GridData) : null

  const metadata = buildPageMetadata({
    title: "Shared grid",
    description: DESCRIPTION,
    pathname: `/tools/grid/${id}`,
    keywords: ["media grid", "shared grid", "velolib"],
  })

  const image = {
    url: `/api/og/tools/grid/${id}`,
    width: 1080,
    height: gridData?.isSquare === false ? 1620 : 1080,
    alt: "Shared media grid",
  }

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { ...metadata.twitter, images: [image.url] },
  }
}
