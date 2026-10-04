import { readFile } from "fs/promises"
import path from "path"
import type { IconNode, LucideIcon } from "lucide-react"

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export const SKY = "#7dd3fc"
export const SEA = "#2dd4bf"
export const BRAND_GRADIENT = `linear-gradient(90deg, ${SKY} 0%, ${SEA} 100%)`
const EYEBROW_RULE_GRADIENT = "linear-gradient(90deg, #67d8eb 0%, #2dd4bf 100%)"

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export function toSiteImageUrl(imagePath: string | null) {
  if (
    !imagePath ||
    !/^\/images\/[\w\-./]+$/.test(imagePath) ||
    imagePath.includes("..")
  )
    return null
  return `${getSiteUrl()}${imagePath}`
}

export async function loadOgFonts() {
  const [
    interRegular,
    interSemiBold,
    interBold,
    merriweatherBold,
    monoRegular,
  ] = await Promise.all([
    readFile(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "public/fonts/Inter-SemiBold.ttf")),
    readFile(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf")),
    readFile(
      path.join(process.cwd(), "public/fonts/Merriweather_120pt-Bold.ttf")
    ),
    readFile(
      path.join(process.cwd(), "public/fonts/JetBrainsMono-Regular.ttf")
    ),
  ])

  return [
    { name: "Inter", data: interRegular, weight: 400, style: "normal" },
    { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
    { name: "Inter", data: interBold, weight: 700, style: "normal" },
    {
      name: "Merriweather",
      data: merriweatherBold,
      weight: 700,
      style: "normal",
    },
    { name: "JetBrains Mono", data: monoRegular, weight: 400, style: "normal" },
  ] as const
}

let topoDataUri: Promise<string> | undefined

export function loadTopo() {
  topoDataUri ??= readFile(
    path.join(process.cwd(), "public/images/topo.svg"),
    "utf8"
  ).then(
    (svg) =>
      `data:image/svg+xml;base64,${Buffer.from(
        svg.replaceAll('stroke="#000"', 'stroke="#fff"')
      ).toString("base64")}`
  )
  return topoDataUri
}

export function OgFrame({
  topo,
  children,
}: {
  topo: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#0a0a0a",
        fontFamily: "Inter",
        color: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={topo}
        alt=""
        width={OG_WIDTH}
        height={OG_HEIGHT}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(125, 211, 252, 0.14) 0%, rgba(0, 0, 0, 0) 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45, 212, 191, 0.10) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "6px",
          backgroundImage: BRAND_GRADIENT,
        }}
      />
    </div>
  )
}

export function OgWordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Merriweather",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            backgroundImage: BRAND_GRADIENT,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          velolib
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "22px",
            color: "#a1a1aa",
          }}
        >
          .dev
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: "16px",
          color: SKY,
          padding: "3px 9px",
          borderRadius: "7px",
          border: "1px solid rgba(14, 165, 233, 0.3)",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
        }}
      >
        @malik
      </div>
    </div>
  )
}

export function OgHeading({
  eyebrow,
  title,
  fontSize = 60,
  maxLines = 2,
  gap = 20,
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  fontSize?: number
  maxLines?: number
  gap?: number
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        maxWidth: "100%",
        gap: `${gap}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "18px",
          fontWeight: 600,
          color: SKY,
          textTransform: "uppercase",
          letterSpacing: "0.28em",
        }}
      >
        {eyebrow}
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            minWidth: "72px",
            height: "5px",
            borderRadius: "9999px",
            backgroundImage: EYEBROW_RULE_GRADIENT,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <OgTitleText fontSize={fontSize} maxLines={maxLines}>
          {title}
        </OgTitleText>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "5px",
            borderRadius: "9999px",
            backgroundImage: BRAND_GRADIENT,
          }}
        />
      </div>
    </div>
  )
}

function OgTitleText({
  children,
  fontSize,
  maxLines,
}: {
  children: React.ReactNode
  fontSize: number
  maxLines: number
}) {
  return (
    <div
      style={{
        fontFamily: "Merriweather",
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        lineHeight: 1.4,
        paddingBottom: `${Math.round(fontSize * 0.08)}px`,
        letterSpacing: "-0.02em",
        backgroundImage: BRAND_GRADIENT,
        backgroundClip: "text",
        color: "transparent",
        lineClamp: maxLines,
        textOverflow: "ellipsis",
        overflow: "hidden",
        textWrap: "balance",
      }}
    >
      {children}
    </div>
  )
}

const OG_ICONS = {
  calendar:
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  sections:
    '<path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/>',
}

function ogIconSrc(icon: keyof typeof OG_ICONS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${SKY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${OG_ICONS[icon]}</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}

export function ogLucideIconSrc(Icon: LucideIcon, color: string) {
  const render = (
    Icon as unknown as {
      render: (props: object, ref: null) => { props: { iconNode?: IconNode } }
    }
  ).render
  const iconNode = render({}, null).props.iconNode ?? []
  const body = iconNode
    .map(([tag, attrs]) => {
      const attributes = Object.entries(attrs)
        .filter(([name]) => name !== "key")
        .map(([name, value]) => `${name}="${value}"`)
        .join(" ")
      return `<${tag} ${attributes}/>`
    })
    .join("")
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}

export type OgMetaItem = { icon: keyof typeof OG_ICONS; label: string }

export function OgMeta({ items }: { items: OgMetaItem[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "26px",
        rowGap: "8px",
        fontSize: "15px",
        fontWeight: 600,
        color: "#a1a1aa",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
      }}
    >
      {items.map(({ icon, label }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ogIconSrc(icon)} alt="" width={18} height={18} />
          {label}
        </div>
      ))}
    </div>
  )
}

export function OgDescription({
  children,
  maxLines = 3,
  fontSize = 24,
}: {
  children: React.ReactNode
  maxLines?: number
  fontSize?: number
}) {
  return (
    <div
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1.5,
        color: "#d4d4d8",
        lineClamp: maxLines,
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  )
}

export function ogImageResponseOptions(
  fonts: Awaited<ReturnType<typeof loadOgFonts>>
) {
  return {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [...fonts],
  }
}
