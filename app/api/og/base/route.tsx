import { ImageResponse } from "takumi-js/response"
import {
  OgDescription,
  OgHeading,
  OgFrame,
  OgWordmark,
  loadOgFonts,
  loadTopo,
  ogImageResponseOptions,
} from "@/lib/og"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get("title") || "velolib.dev"
    const description =
      searchParams.get("description") ||
      "Explore software, media, and development notes."
    const eyebrow = searchParams.get("eyebrow") || "Page"

    const [fonts, topo] = await Promise.all([loadOgFonts(), loadTopo()])

    return new ImageResponse(
      <OgFrame topo={topo}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 72px 64px",
          }}
        >
          <OgWordmark />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "960px",
            }}
          >
            <OgHeading eyebrow={eyebrow} title={title} fontSize={68} />
            <OgDescription maxLines={2}>{description}</OgDescription>
          </div>
        </div>
      </OgFrame>,
      ogImageResponseOptions(fonts)
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image`, { status: 500 })
  }
}
