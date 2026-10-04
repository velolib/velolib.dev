import { ImageResponse } from "takumi-js/response"
import {
  BRAND_GRADIENT,
  OgDescription,
  OgHeading,
  OgMeta,
  type OgMetaItem,
  OgFrame,
  OgWordmark,
  loadOgFonts,
  loadTopo,
  ogImageResponseOptions,
  toSiteImageUrl,
} from "@/lib/og"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const COVER_WIDTH = 500
const COVER_HEIGHT = Math.round((COVER_WIDTH * 9) / 16)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const cover = toSiteImageUrl(searchParams.get("cover"))
    const title = searchParams.get("title") || "Missing Title"
    const description = searchParams.get("description") || ""
    const date = searchParams.get("date")
    const readingTime = searchParams.get("readingTime")
    const sections = Number(searchParams.get("sections")) || 0

    const meta: OgMetaItem[] = [
      ...(date ? [{ icon: "calendar" as const, label: date }] : []),
      ...(readingTime
        ? [{ icon: "clock" as const, label: `${readingTime} min read` }]
        : []),
      ...(sections > 0
        ? [
            {
              icon: "sections" as const,
              label: `${sections} ${sections === 1 ? "section" : "sections"}`,
            },
          ]
        : []),
    ]

    const [fonts, topo] = await Promise.all([loadOgFonts(), loadTopo()])

    return new ImageResponse(
      <OgFrame topo={topo}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "56px",
            width: "100%",
            padding: "56px 64px 64px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              flex: 1,
              minWidth: 0,
            }}
          >
            <OgWordmark />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <OgHeading
                eyebrow="Blog"
                title={title}
                fontSize={52}
                maxLines={3}
              />
              <OgDescription maxLines={2} fontSize={22}>
                {description}
              </OgDescription>
              {meta.length > 0 && <OgMeta items={meta} />}
            </div>
          </div>

          {cover && (
            <div
              style={{
                display: "flex",
                padding: "1px",
                borderRadius: "28px",
                backgroundImage: BRAND_GRADIENT,
                transform: "rotate(2deg)",
                boxShadow: "0 30px 80px rgba(56, 189, 248, 0.18)",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt=""
                width={COVER_WIDTH}
                height={COVER_HEIGHT}
                style={{
                  width: `${COVER_WIDTH}px`,
                  height: `${COVER_HEIGHT}px`,
                  objectFit: "cover",
                  borderRadius: "27px",
                }}
              />
            </div>
          )}
        </div>
      </OgFrame>,
      ogImageResponseOptions(fonts)
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image`, { status: 500 })
  }
}
