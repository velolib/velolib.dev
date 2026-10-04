/* eslint-disable @next/next/no-img-element */
import { readFile } from "fs/promises"
import path from "path"
import { ImageResponse } from "takumi-js/response"

import { getSharedGrid } from "@/lib/grid"
import type { GridData } from "@/lib/grid"
import { OgFrame, OgWordmark, SKY, loadOgFonts, loadTopo } from "@/lib/og"

const WIDTH = 1080
const PADDING = 48
const HEADER_HEIGHT = 44
const HEADER_GAP = 32
const GAP = 16

let placeholder: Promise<string> | undefined

function loadPlaceholder() {
  placeholder ??= readFile(
    path.join(process.cwd(), "public/images/placeholder.webp")
  ).then((bytes) => `data:image/webp;base64,${bytes.toString("base64")}`)
  return placeholder
}

interface Media {
  poster: string
  title?: string
  label?: string
}

interface OgGridProps {
  medias: (Media | null)[]
  showTitles: boolean
  showLabels: boolean
  isSquare: boolean
  height: number
}

function getCellSize(isSquare: boolean, height: number) {
  const ratio = isSquare ? 1 : 2 / 3
  const maxWidth = (WIDTH - PADDING * 2 - GAP * 2) / 3
  const maxHeight =
    (height - PADDING * 2 - HEADER_HEIGHT - HEADER_GAP - GAP * 2) / 3
  const width = Math.floor(Math.min(maxWidth, maxHeight * ratio))
  return { width, height: Math.floor(width / ratio) }
}

function SlotNumber({ index }: { index: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        display: "flex",
        padding: "2px 9px",
        borderRadius: "9999px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontFamily: "JetBrains Mono",
        fontSize: "14px",
        color: "#ffffff",
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </div>
  )
}

function OgGrid({
  medias,
  showTitles,
  showLabels,
  isSquare,
  height,
}: OgGridProps) {
  const cell = getCellSize(isSquare, height)
  const rows = [0, 1, 2].map((row) => medias.slice(row * 3, row * 3 + 3))

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: `${PADDING}px`,
        gap: `${HEADER_GAP}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: `${HEADER_HEIGHT}px`,
        }}
      >
        <OgWordmark />
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "18px",
            color: "#a1a1aa",
          }}
        >
          made with
          <div style={{ display: "flex", marginLeft: "10px", color: SKY }}>
            grid.velolib.dev
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          gap: `${GAP}px`,
        }}
      >
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: `${GAP}px` }}>
            {row.map((media, colIndex) => {
              const index = rowIndex * 3 + colIndex
              const title = showTitles ? media?.title : undefined
              const label = showLabels ? media?.label : undefined

              return (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "flex",
                    width: `${cell.width}px`,
                    height: `${cell.height}px`,
                    overflow: "hidden",
                    borderRadius: "20px",
                    border: media
                      ? "1px solid rgba(255, 255, 255, 0.12)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: media
                      ? "#18181b"
                      : "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  {media && (
                    <img
                      src={media.poster}
                      alt=""
                      width={cell.width}
                      height={cell.height}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {(title || label) && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        gap: "4px",
                        padding: "16px",
                        backgroundImage:
                          "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 60%)",
                      }}
                    >
                      {title && (
                        <div
                          style={{
                            fontFamily: "Merriweather",
                            fontSize: "19px",
                            fontWeight: 700,
                            lineHeight: 1.35,
                            color: "#ffffff",
                            lineClamp: 2,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {title}
                        </div>
                      )}
                      {label && (
                        <div
                          style={
                            title
                              ? {
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "15px",
                                  color: "#bae6fd",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }
                              : {
                                  fontFamily: "Merriweather",
                                  fontSize: "19px",
                                  fontWeight: 700,
                                  color: "#ffffff",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }
                          }
                        >
                          {label}
                        </div>
                      )}
                    </div>
                  )}

                  <SlotNumber index={index} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export const runtime = "nodejs"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const shared = await getSharedGrid(id)

  if (!shared) {
    return new Response("Not found", { status: 404 })
  }

  const grid = JSON.parse(shared.data) as GridData
  const height = grid.isSquare ? 1080 : 1620

  const [fonts, topo, medias] = await Promise.all([
    loadOgFonts(),
    loadTopo(),
    Promise.all(
      grid.medias.map(async (media) => {
        if (!media) return null

        try {
          const res = await fetch(media.posterUrl)

          if (!res.ok) throw new Error()

          const contentType = res.headers.get("content-type") ?? "image/jpeg"

          const bytes = await res.arrayBuffer()

          return {
            poster: `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`,
            title: media.title,
            label: media.label,
          }
        } catch {
          return {
            poster: await loadPlaceholder(),
            title: media.title,
            label: media.label,
          }
        }
      })
    ),
  ])

  return new ImageResponse(
    <OgFrame topo={topo}>
      <OgGrid
        medias={medias}
        showTitles={grid.showTitles}
        showLabels={grid.showLabels}
        isSquare={grid.isSquare}
        height={height}
      />
    </OgFrame>,
    {
      width: WIDTH,
      height,
      fonts: [...fonts],
      format: "png",
    }
  )
}
