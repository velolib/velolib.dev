import { notFound } from "next/navigation"
import { getSharedGrid } from "@/lib/grid"
import { SectionShell } from "@/components/shared/section-shell"
import { GridData } from "@/lib/grid"
import { ReadonlyMediaCard } from "@/components/tools/grid/readonly-media-card"
import { ShareDialog } from "@/components/tools/grid/share-dialog"
import type { Metadata } from "next"
import GradientBackground from "@/components/layout/gradient-background"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface SharePageProps {
  params: Promise<{ id: string }>
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params

  const sharedGrid = await getSharedGrid(id)

  if (!sharedGrid) {
    notFound()
  }

  const gridData = JSON.parse(sharedGrid.data) as GridData

  // console.log('Grid data:', gridData);

  return (
    <main className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth">
      <SectionShell
        id="share"
        eyebrow={id}
        title="Shared grid"
        description={`Expires at ${new Date(sharedGrid.expires_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`}
        buttonText="Make your own"
        buttonHref="/tools/grid"
      >
        <GradientBackground />
        <ShareDialog id={id} gridData={gridData} />
        <ScrollArea className="w-full">
          <div className="grid min-w-200 grid-cols-3 gap-4 sm:min-w-300 lg:min-w-full">
            {gridData.medias.map((media, index) => (
              <div key={index}>
                {media ? (
                  <ReadonlyMediaCard
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
                  <ReadonlyMediaCard isSquare={gridData.isSquare} />
                )}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SectionShell>
    </main>
  )
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { id } = await params

  const sharedGrid = await getSharedGrid(id)

  const gridData = sharedGrid ? (JSON.parse(sharedGrid.data) as GridData) : null

  return {
    title: "Shared grid",
    description: "Check out this shared media grid!",
    openGraph: {
      images: [
        {
          url: `/api/og/tools/grid/${id}`,
          width: 1080,
          height: sharedGrid ? (gridData?.isSquare ? 1080 : 1620) : 1080,
          alt: "Shared media grid",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og/tools/grid/${id}`],
    },
  }
}
