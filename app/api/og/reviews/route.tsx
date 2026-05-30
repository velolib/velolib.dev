import { ImageResponse } from "next/og"

export const runtime = "edge"
export const revalidate = 604800 // Cache for 1 week

// --- COLOR SYSTEM HELPER ---
const COLORS: Record<string, { bg: string; border: string; text: string }> = {
  emerald: {
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#6ee7b7",
  },
  cyan: {
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.3)",
    text: "#67e8f9",
  },
  sky: {
    bg: "rgba(14, 165, 233, 0.1)",
    border: "rgba(14, 165, 233, 0.3)",
    text: "#7dd3fc",
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#fcd34d",
  },
  rose: {
    bg: "rgba(244, 63, 94, 0.1)",
    border: "rgba(244, 63, 94, 0.3)",
    text: "#fda4af",
  },
  fuchsia: {
    bg: "rgba(217, 70, 239, 0.1)",
    border: "rgba(217, 70, 239, 0.3)",
    text: "#f0abfc",
  },
  blue: {
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
    text: "#93c5fd",
  },
  zinc: {
    bg: "rgba(113, 113, 122, 0.1)",
    border: "rgba(113, 113, 122, 0.3)",
    text: "#d4d4d8",
  },
  orange: {
    bg: "rgba(249, 115, 22, 0.1)",
    border: "rgba(249, 115, 22, 0.3)",
    text: "#fdba74",
  },
  violet: {
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.3)",
    text: "#c4b5fd",
  },
  teal: {
    bg: "rgba(20, 184, 166, 0.1)",
    border: "rgba(20, 184, 166, 0.3)",
    text: "#5eead4",
  },
  slate: {
    bg: "rgba(100, 116, 139, 0.1)",
    border: "rgba(100, 116, 139, 0.3)",
    text: "#cbd5e1",
  },
  stone: {
    bg: "rgba(120, 113, 108, 0.1)",
    border: "rgba(120, 113, 108, 0.3)",
    text: "#d6d3d1",
  },
  yellow: {
    bg: "rgba(234, 179, 8, 0.1)",
    border: "rgba(234, 179, 8, 0.3)",
    text: "#fde047",
  },
  pink: {
    bg: "rgba(236, 72, 153, 0.1)",
    border: "rgba(236, 72, 153, 0.3)",
    text: "#f9a8d4",
  },
  green: {
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.3)",
    text: "#86efac",
  },
  red: {
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#fca5a5",
  },
  gray: {
    bg: "rgba(107, 114, 128, 0.1)",
    border: "rgba(107, 114, 128, 0.3)",
    text: "#d1d5db",
  },
  default: {
    bg: "rgba(255, 255, 255, 0.1)",
    border: "rgba(255, 255, 255, 0.2)",
    text: "#ffffff",
  },
}

function getColorsForBadge(type: string, value: string | number) {
  let colorKey = "default"

  if (type === "rating") {
    const r = Number(value)
    if (r >= 9) colorKey = "emerald"
    else if (r >= 7) colorKey = "cyan"
    else if (r >= 5) colorKey = "yellow"
    else if (r >= 3) colorKey = "orange"
    else colorKey = "rose"
  } else if (type === "quality") {
    if (String(value).includes("Gem")) colorKey = "emerald"
    else if (String(value).includes("Mid")) colorKey = "sky"
    else colorKey = "rose"
  } else if (type === "enjoyment") {
    const map: Record<string, string> = {
      "Loved it": "fuchsia",
      "Liked it": "emerald",
      Mixed: "blue",
      Meh: "zinc",
      "Didn't like it": "orange",
      "Hated it": "rose",
    }
    colorKey = map[String(value)] || "default"
  } else if (type === "impact") {
    const map: Record<string, string> = {
      Lingering: "violet",
      Memorable: "teal",
      Fleeting: "slate",
      Forgettable: "stone",
    }
    colorKey = map[String(value)] || "default"
  } else if (type === "status") {
    const map: Record<string, string> = {
      Finished: "green",
      Watching: "yellow",
      Dropped: "red",
      Waiting: "blue",
      Canceled: "gray",
    }
    colorKey = map[String(value)] || "default"
  } else if (type === "medium") {
    const map: Record<string, string> = {
      Anime: "violet",
      "Live Action": "amber",
      Animation: "cyan",
      Donghua: "fuchsia",
    }
    colorKey = map[String(value)] || "default"
  } else if (type === "format") {
    const map: Record<string, string> = { Series: "sky", Movie: "emerald" }
    colorKey = map[String(value)] || "default"
  } else if (type === "genre") {
    const map: Record<string, string> = {
      Action: "rose",
      Comedy: "yellow",
      Drama: "orange",
      Romance: "fuchsia",
      "Sci-Fi": "cyan",
      Fantasy: "emerald",
      Horror: "slate",
      Mystery: "violet",
      "Slice of Life": "pink",
    }
    colorKey = map[String(value)] || "default"
  }

  return COLORS[colorKey] || COLORS.default
}

// Badge Component inside Satori
function Badge({
  type,
  value,
  showStar = false,
}: {
  type: string
  value: string | number
  showStar?: boolean
}) {
  const { bg, border, text } = getColorsForBadge(type, value)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        borderRadius: "9999px",
        fontSize: "14px",
        fontWeight: 600,
        backgroundColor: bg,
        borderColor: border,
        borderStyle: "solid",
        borderWidth: "1px",
        color: text,
      }}
    >
      <span>{value}</span>
      {showStar && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )}
    </div>
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Dynamic Site URL for Background Images (Localhost vs Vercel Prod)
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const host =
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "localhost:3000"
    const siteUrl = `${protocol}://${host}`

    // Core Data
    const slug = searchParams.get("slug")
    const title = searchParams.get("title") || "Missing Title"
    const description = searchParams.get("description") || ""
    const eyebrow = searchParams.get("eyebrow") || "Review"

    // Review Stats
    const rating = searchParams.get("rating") || "0"
    const quality = searchParams.get("quality")
    const enjoyment = searchParams.get("enjoyment")
    const impact = searchParams.get("impact")
    const status = searchParams.get("status")

    // Tags
    const medium = searchParams.get("medium")
    const format = searchParams.get("format")
    const genresRaw = searchParams.get("genres")
    const genres = genresRaw ? genresRaw.split(",").map((g) => g.trim()) : []

    // Parallelize font fetching for max speed
    const [interRegular, interSemiBold, interBold, merriweatherBold] =
      await Promise.all([
        fetch(new URL("../Inter-Regular.ttf", import.meta.url)).then((res) =>
          res.arrayBuffer()
        ),
        fetch(new URL("../Inter-SemiBold.ttf", import.meta.url)).then((res) =>
          res.arrayBuffer()
        ),
        fetch(new URL("../Inter-Bold.ttf", import.meta.url)).then((res) =>
          res.arrayBuffer()
        ),
        fetch(new URL("../Merriweather_120pt-Bold.ttf", import.meta.url)).then(
          (res) => res.arrayBuffer()
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
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Background Image inferred from slug */}
        {slug && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${siteUrl}/images/reviews/${slug}/og.jpeg`}
            alt="Backdrop"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.2,
            }}
            width={1920}
            height={1080}
          />
        )}

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.12) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 20% 100%, rgba(45, 212, 191, 0.08) 0%, rgba(0, 0, 0, 0) 50%)",
          }}
        />

        {/* Content Wrapper */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "64px",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div
            style={{
              position: "absolute",
              top: "-16px",
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

          {/* Typography Block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "16px",
              gap: "12px",
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

          {/* Badges Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "48px",
              marginTop: "40px",
              width: "100%",
            }}
          >
            {/* Column 1: Review Metrics */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                }}
              >
                Review
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Badge type="rating" value={rating} showStar={true} />
                {quality && <Badge type="quality" value={quality} />}
                {enjoyment && <Badge type="enjoyment" value={enjoyment} />}
                {impact && <Badge type="impact" value={impact} />}
                {status && <Badge type="status" value={status} />}
              </div>
            </div>

            {/* Column 2: Tags */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                }}
              >
                Tags
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {medium && <Badge type="medium" value={medium} />}
                {format && <Badge type="format" value={format} />}
                {genres.map((g) => (
                  <Badge key={g} type="genre" value={g} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
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
