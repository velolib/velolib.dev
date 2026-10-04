import { ImageResponse } from "takumi-js/response"
import { allPosts, allReviews } from "content-collections"
import { PROJECTS } from "@/lib/projects"
import {
  BRAND_GRADIENT,
  OgFrame,
  OgWordmark,
  loadOgFonts,
  loadTopo,
  ogImageResponseOptions,
  ogLucideIconSrc,
} from "@/lib/og"
import { House, MapPin, type LucideIcon } from "lucide-react"

export const runtime = "nodejs"
export const dynamic = "force-static"

const REEL = [
  { name: "velocitize", opacity: 0.2 },
  { name: "velo", opacity: 1 },
  { name: "veloLib", opacity: 0.2 },
]

// Matches the hero and footer location badges (rose pin, orange home).
const LOCATIONS = [
  {
    label: "Shenzhen, China",
    icon: MapPin,
    rgb: "244, 63, 94",
    text: "#fda4af",
  },
  {
    label: "From Jakarta, Indonesia",
    icon: House,
    rgb: "249, 115, 22",
    text: "#fdba74",
  },
]

function Badge({
  children,
  icon,
  rgb,
  text,
}: {
  children: React.ReactNode
  icon: LucideIcon
  rgb: string
  text: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "7px 14px",
        borderRadius: "9999px",
        fontSize: "18px",
        fontWeight: 600,
        border: `1px solid rgba(${rgb}, 0.35)`,
        backgroundColor: `rgba(${rgb}, 0.12)`,
        color: text,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ogLucideIconSrc(icon, text)} alt="" width={18} height={18} />
      {children}
    </div>
  )
}

export async function GET() {
  try {
    const stats = [
      { label: "Posts", value: allPosts.length },
      { label: "Reviews", value: allReviews.length },
      { label: "Projects", value: PROJECTS.length },
    ]

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <OgWordmark />
            <div
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: "16px",
                color: "#71717a",
              }}
            >
              22.5431° N · 114.0579° E
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "48px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#a1a1aa",
                  textTransform: "uppercase",
                  letterSpacing: "0.32em",
                }}
              >
                Hi, I&apos;m
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {REEL.map(({ name, opacity }) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      fontFamily: "Merriweather",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      fontSize: opacity === 1 ? "112px" : "44px",
                      lineHeight: opacity === 1 ? 1.25 : 1.3,
                      opacity,
                      backgroundImage: BRAND_GRADIENT,
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                {LOCATIONS.map(({ label, ...badge }) => (
                  <Badge key={label} {...badge}>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "330px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: "rgba(24, 24, 27, 0.72)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "26px 28px 22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#a1a1aa",
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                  }}
                >
                  Also known as
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Merriweather",
                    fontSize: "40px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Malik
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "18px",
                    lineHeight: 1.5,
                    color: "#d4d4d8",
                  }}
                >
                  Web developer & Minecraft modder. Writing, reviews and
                  projects.
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                {stats.map(({ label, value }, index) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      flex: 1,
                      padding: "18px 0 20px",
                      borderLeft:
                        index > 0
                          ? "1px solid rgba(255, 255, 255, 0.12)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontFamily: "Merriweather",
                        fontSize: "34px",
                        fontWeight: 700,
                        backgroundImage: BRAND_GRADIENT,
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#a1a1aa",
                        textTransform: "uppercase",
                        letterSpacing: "0.28em",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
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
