import { ImageResponse } from "takumi-js/response"
import {
  REVIEW_ENJOYMENTS,
  REVIEW_FORMATS,
  REVIEW_GENRES,
  REVIEW_IMPACTS,
  REVIEW_MEDIUMS,
  REVIEW_QUALITIES,
  REVIEW_STATUSES,
} from "@/lib/review-taxonomy"
import {
  BRAND_GRADIENT,
  OgHeading,
  OgFrame,
  OgWordmark,
  OgMeta,
  ogLucideIconSrc,
  getSiteUrl,
  loadOgFonts,
  loadTopo,
  ogImageResponseOptions,
  toSiteImageUrl,
} from "@/lib/og"
import { getReviewIcon } from "@/lib/review-icons"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ReviewMedium = (typeof REVIEW_MEDIUMS)[number]
type ReviewFormat = (typeof REVIEW_FORMATS)[number]
type ReviewGenre = (typeof REVIEW_GENRES)[number]
type ReviewStatus = (typeof REVIEW_STATUSES)[number]
type ReviewQuality = (typeof REVIEW_QUALITIES)[number]
type ReviewEnjoyment = (typeof REVIEW_ENJOYMENTS)[number]
type ReviewImpact = (typeof REVIEW_IMPACTS)[number]

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

function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  )
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
  const Icon = getReviewIcon(type, value)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "6px 14px",
        borderRadius: "9999px",
        fontSize: "15px",
        fontWeight: 600,
        backgroundColor: bg,
        borderColor: border,
        borderStyle: "solid",
        borderWidth: "1px",
        alignSelf: "flex-start",
        color: text,
      }}
    >
      {Icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ogLucideIconSrc(Icon, text)} alt="" width={15} height={15} />
      )}
      <span>{value}</span>
      {showStar && <StarIcon size={14} color={text} />}
    </div>
  )
}

const POSTER_WIDTH = 300
const POSTER_HEIGHT = Math.round(POSTER_WIDTH / 0.68)
const SLUG_PATTERN = /^[a-z0-9-]+$/

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const slugParam = searchParams.get("slug")
    const slug = slugParam && SLUG_PATTERN.test(slugParam) ? slugParam : null
    const poster = toSiteImageUrl(searchParams.get("poster"))
    const title = searchParams.get("title") || "Missing Title"
    const description = searchParams.get("description") || ""
    const eyebrow = searchParams.get("eyebrow") || "Review"
    const date = searchParams.get("date")

    const rating = searchParams.get("rating") || "0"
    const quality = searchParams.get("quality")
    const enjoyment = searchParams.get("enjoyment")
    const impact = searchParams.get("impact")
    const status = searchParams.get("status")

    const medium = searchParams.get("medium")
    const format = searchParams.get("format")
    const genresRaw = searchParams.get("genres")
    const genres = genresRaw
      ? genresRaw
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : []

    const [fonts, topo] = await Promise.all([loadOgFonts(), loadTopo()])

    return new ImageResponse(
      <OgFrame topo={topo}>
        {slug && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${getSiteUrl()}/images/reviews/${slug}/og.jpeg`}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.3,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(10, 10, 10, 0.35) 0%, rgba(10, 10, 10, 0.85) 45%, rgba(10, 10, 10, 0.95) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "56px",
            width: "100%",
            padding: "56px 72px 64px 64px",
            position: "relative",
          }}
        >
          {poster && (
            <div
              style={{
                display: "flex",
                position: "relative",
                padding: "1px",
                borderRadius: "24px",
                backgroundImage: BRAND_GRADIENT,
                transform: "rotate(-2deg)",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6)",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt=""
                width={POSTER_WIDTH}
                height={POSTER_HEIGHT}
                style={{
                  width: `${POSTER_WIDTH}px`,
                  height: `${POSTER_HEIGHT}px`,
                  objectFit: "cover",
                  borderRadius: "23px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontFamily: "Merriweather",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {rating}
                <StarIcon size={20} color="#fcd34d" />
              </div>
            </div>
          )}

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
              <OgHeading eyebrow={eyebrow} title={title} fontSize={50} />
              {date && <OgMeta items={[{ icon: "calendar", label: date }]} />}
              {description && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "22px",
                    lineHeight: 1.5,
                    color: "#e4e4e7",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Merriweather",
                      fontSize: "48px",
                      lineHeight: 1,
                      height: "33px",
                      backgroundImage: BRAND_GRADIENT,
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    &ldquo;
                  </span>
                  <span
                    style={{
                      fontStyle: "italic",
                      lineClamp: 2,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {description}
                  </span>
                  <span
                    style={{
                      alignSelf: "flex-end",
                      fontFamily: "Merriweather",
                      fontSize: "48px",
                      lineHeight: 1,
                      height: "33px",
                      transform: "rotate(180deg)",
                      backgroundImage: BRAND_GRADIENT,
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    &ldquo;
                  </span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {!poster && (
                    <Badge type="rating" value={rating} showStar={true} />
                  )}
                  {quality && <Badge type="quality" value={quality} />}
                  {enjoyment && <Badge type="enjoyment" value={enjoyment} />}
                  {impact && <Badge type="impact" value={impact} />}
                  {status && <Badge type="status" value={status} />}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {medium && <Badge type="medium" value={medium} />}
                  {format && <Badge type="format" value={format} />}
                  {genres.map((g) => (
                    <Badge key={g} type="genre" value={g} />
                  ))}
                </div>
              </div>
            </div>
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
