/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "takumi-js/response"

import { getSharedGrid } from "@/lib/grid"
import type { GridData } from "@/lib/grid"

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
}

function OgGrid({ medias, showTitles, showLabels, isSquare }: OgGridProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gridTemplateRows: isSquare ? "repeat(3,1fr)" : "repeat(3,2fr)",
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          padding: "10px 16px",
          fontSize: 16,
          fontWeight: 600,
          zIndex: 100,
        }}
      >
        made using{" "}
        <span style={{ color: "#08aeea", marginLeft: 4 }}>
          grid.velolib.dev
        </span>
      </div>

      {medias.map((media, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            backgroundColor: "#111",
          }}
        >
          {media ? (
            <>
              <img
                src={media.poster || "/images/placeholder.webp"}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {(showTitles || showLabels) && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    rowGap: 4,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  {showTitles && (
                    <div
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.25,
                        display: "flex",
                        flexDirection: "column",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                      }}
                    >
                      {media.title}
                    </div>
                  )}

                  {showLabels && (
                    <div
                      style={{
                        color: "#fff",
                        fontSize: showTitles ? 12 : 14,
                        fontWeight: showTitles ? 400 : 600,
                        width: "100%",
                        paddingLeft: 24,
                        paddingRight: 24,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {media.label}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 56,
                fontWeight: 300,
              }}
            ></div>
          )}
        </div>
      ))}
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

  const medias = await Promise.all(
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
          poster: "",
          title: media.title,
          label: media.label,
        }
      }
    })
  )

  return new ImageResponse(
    <OgGrid
      medias={medias}
      showTitles={grid.showTitles}
      showLabels={grid.showLabels}
      isSquare={grid.isSquare}
    />,
    {
      width: 1080,
      height: grid.isSquare ? 1080 : 1620,
      format: "png",
    }
  )
}
