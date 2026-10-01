import { readFile } from "fs/promises"
import { ImageResponse } from "takumi-js/response"
import path from "path"
import {
  REVIEW_ENJOYMENTS,
  REVIEW_FORMATS,
  REVIEW_GENRES,
  REVIEW_IMPACTS,
  REVIEW_MEDIUMS,
  REVIEW_QUALITIES,
  REVIEW_STATUSES,
} from "@/lib/review-taxonomy"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ReviewMedium = (typeof REVIEW_MEDIUMS)[number]
type ReviewFormat = (typeof REVIEW_FORMATS)[number]
type ReviewGenre = (typeof REVIEW_GENRES)[number]
type ReviewStatus = (typeof REVIEW_STATUSES)[number]
type ReviewQuality = (typeof REVIEW_QUALITIES)[number]
type ReviewEnjoyment = (typeof REVIEW_ENJOYMENTS)[number]
type ReviewImpact = (typeof REVIEW_IMPACTS)[number]

// --- COLOR SYSTEM HELPER ---
// Each palette = Tailwind's -500 shade as RGB (for bg/border) + -300 shade
// (for text), mirroring the dark-mode classes used in ReviewBadge.
const PALETTE = {
  emerald: { rgb: "16, 185, 129", text: "#6ee7b7" },
  cyan: { rgb: "6, 182, 212", text: "#67e8f9" },
  sky: { rgb: "14, 165, 233", text: "#7dd3fc" },
  amber: { rgb: "245, 158, 11", text: "#fcd34d" },
  rose: { rgb: "244, 63, 94", text: "#fda4af" },
  fuchsia: { rgb: "217, 70, 239", text: "#f0abfc" },
  blue: { rgb: "59, 130, 246", text: "#93c5fd" },
  zinc: { rgb: "113, 113, 122", text: "#d4d4d8" },
  orange: { rgb: "249, 115, 22", text: "#fdba74" },
  violet: { rgb: "139, 92, 246", text: "#c4b5fd" },
  teal: { rgb: "20, 184, 166", text: "#5eead4" },
  slate: { rgb: "100, 116, 139", text: "#cbd5e1" },
  stone: { rgb: "120, 113, 108", text: "#d6d3d1" },
  yellow: { rgb: "234, 179, 8", text: "#fde047" },
  pink: { rgb: "236, 72, 153", text: "#f9a8d4" },
  green: { rgb: "34, 197, 94", text: "#86efac" },
  red: { rgb: "239, 68, 68", text: "#fca5a5" },
  gray: { rgb: "107, 114, 128", text: "#d1d5db" },
  indigo: { rgb: "99, 102, 241", text: "#a5b4fc" },
  lime: { rgb: "132, 204, 22", text: "#bef264" },
} as const

type ColorKey = keyof typeof PALETTE

type Tone = ColorKey | { color: ColorKey; border: number }

const DEFAULT_COLORS = {
  bg: "rgba(255, 255, 255, 0.1)",
  border: "rgba(255, 255, 255, 0.2)",
  text: "#ffffff",
}

function resolveTone(tone: Tone | undefined) {
  if (!tone) return DEFAULT_COLORS
  const color = typeof tone === "string" ? tone : tone.color
  const borderAlpha = typeof tone === "string" ? 0.3 : tone.border
  const { rgb, text } = PALETTE[color]
  return {
    bg: `rgba(${rgb}, 0.1)`,
    border: `rgba(${rgb}, ${borderAlpha})`,
    text,
  }
}

const QUALITY_TONES = {
  "Gem-Gem": "emerald",
  "Gem-Mid": "emerald",
  "Gem-Slop": { color: "emerald", border: 0.2 },
  "Mid-Gem": "cyan",
  "Mid-Mid": "sky",
  "Mid-Slop": { color: "sky", border: 0.2 },
  "Slop-Gem": "amber",
  "Slop-Mid": { color: "amber", border: 0.2 },
  "Slop-Slop": "rose",
} satisfies Record<ReviewQuality, Tone>

const ENJOYMENT_TONES = {
  "Loved it": "fuchsia",
  "Liked it": "emerald",
  Mixed: "blue",
  Meh: "zinc",
  "Didn't like it": "orange",
  "Hated it": "rose",
} satisfies Record<ReviewEnjoyment, Tone>

const IMPACT_TONES = {
  Lingering: "violet",
  Memorable: "teal",
  Fleeting: "slate",
  Forgettable: "stone",
} satisfies Record<ReviewImpact, Tone>

const STATUS_TONES = {
  Finished: "green",
  Watching: "yellow",
  Dropped: "red",
  Waiting: "blue",
  Canceled: "gray",
} satisfies Record<ReviewStatus, Tone>

const MEDIUM_TONES = {
  "Live Action": "amber",
  Anime: "violet",
  Animation: "cyan",
  Donghua: "fuchsia",
  Book: "orange",
  Manga: "rose",
  "Light Novel": "indigo",
} satisfies Record<ReviewMedium, Tone>

const FORMAT_TONES = {
  Series: "sky",
  Movie: "emerald",
  Novel: "orange",
  "Light Novel": "indigo",
  Comic: "rose",
  Webtoon: "lime",
  Anthology: "violet",
  "Short Story": "teal",
} satisfies Record<ReviewFormat, Tone>

const GENRE_TONES = {
  Action: "rose",
  Comedy: "yellow",
  Drama: "orange",
  Romance: "fuchsia",
  "Sci-Fi": "cyan",
  Fantasy: "emerald",
  Horror: "slate",
  Mystery: "violet",
  "Slice of Life": "pink",
} satisfies Record<ReviewGenre, Tone>

type BadgeType =
  | "rating"
  | "quality"
  | "enjoyment"
  | "impact"
  | "medium"
  | "format"
  | "genre"
  | "status"

const TONE_MAPS: Record<Exclude<BadgeType, "rating">, Record<string, Tone>> = {
  quality: QUALITY_TONES,
  enjoyment: ENJOYMENT_TONES,
  impact: IMPACT_TONES,
  medium: MEDIUM_TONES,
  format: FORMAT_TONES,
  genre: GENRE_TONES,
  status: STATUS_TONES,
}

function getRatingTone(rating: number): ColorKey {
  if (rating >= 9) return "emerald"
  if (rating >= 7) return "cyan"
  if (rating >= 5) return "yellow"
  if (rating >= 3) return "orange"
  return "rose"
}

function getColorsForBadge(type: BadgeType, value: string | number) {
  if (type === "rating") return resolveTone(getRatingTone(Number(value)))
  return resolveTone(TONE_MAPS[type][String(value)])
}

function Badge({
  type,
  value,
  showStar = false,
}: {
  type: BadgeType
  value: string | number
  showStar?: boolean
}) {
  const { bg, border, text } = getColorsForBadge(type, value)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "6px 14px",
        borderRadius: "9999px",
        fontSize: "14px",
        fontWeight: 600,
        backgroundColor: bg,
        borderColor: border,
        borderStyle: "solid",
        borderWidth: "1px",
        alignSelf: "flex-start",
        color: text,
      }}
    >
      <span>{value}</span>
      {showStar && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={text}
          stroke={text}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "inline-block", verticalAlign: "middle" }}
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
    let siteUrl = "http://localhost:3000"
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      siteUrl = process.env.NEXT_PUBLIC_SITE_URL // Already contains https://
    } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      siteUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    } else if (process.env.VERCEL_URL) {
      siteUrl = `https://${process.env.VERCEL_URL}`
    }

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
    const genres = genresRaw
      ? genresRaw
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : []

    // Parallelize font fetching for max speed
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