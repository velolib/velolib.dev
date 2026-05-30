import { readFile } from "fs/promises"
import path from "path"
import { ImageResponse } from "next/og"

export const revalidate = 604800

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get("title") || "velolib.dev"
    const description =
      searchParams.get("description") ||
      "Explore software, media, and development notes."
    const eyebrow = searchParams.get("eyebrow") || "Page"

    const [interRegular, interSemiBold, interBold, merriweatherBold] =
      await Promise.all([
        readFile(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
        readFile(path.join(process.cwd(), "public/fonts/Inter-SemiBold.ttf")),
        readFile(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf")),
        readFile(
          path.join(process.cwd(), "public/fonts/Merriweather_120pt-Bold.ttf")
        ),
      ])

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.08) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 20% 100%, rgba(45, 212, 191, 0.05) 0%, rgba(0, 0, 0, 0) 50%)",
          padding: "64px",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "64px",
            display: "flex",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontFamily: "Merriweather",
          }}
        >
          <span style={{ color: "#38bdf8" }}>v</span>
          <span style={{ color: "#37bff2" }}>e</span>
          <span style={{ color: "#36c2ed" }}>l</span>
          <span style={{ color: "#35c4e7" }}>o</span>
          <span style={{ color: "#34c6e1" }}>l</span>
          <span style={{ color: "#33c9dc" }}>i</span>
          <span style={{ color: "#31cbd6" }}>b</span>
          <span style={{ color: "#30cdd0" }}>.</span>
          <span style={{ color: "#2fd0cb" }}>d</span>
          <span style={{ color: "#2ed2c5" }}>e</span>
          <span style={{ color: "#2dd4bf" }}>v</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "24px",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              fontFamily: "Merriweather",
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
              color: "#ffffff",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: 400,
              color: "#d1d5db",
              lineHeight: 1.5,
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #38bdf8 0%, #2dd4bf 100%)",
          }}
        />
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Inter", data: interRegular, weight: 400, style: "normal" },
          { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
          { name: "Inter", data: interBold, weight: 700, style: "normal" },
          {
            name: "Merriweather",
            data: merriweatherBold,
            weight: 700,
            style: "normal",
          },
        ],
      }
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image`, { status: 500 })
  }
}
