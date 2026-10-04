import { cn } from "@/lib/utils"

const RINGS = Array.from({ length: 6 }, (_, i) => ({
  cx: 80 + i * 2,
  cy: 112 - i * 6,
  rx: 52 - i * 8,
  ry: 76 - i * 12,
  rotate: i * 6,
}))

const PEAK = RINGS[RINGS.length - 1]

export function TopoZero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <defs>
        <linearGradient id="topo-zero-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-sky-300)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-sea-300)" }} />
        </linearGradient>
      </defs>

      <ellipse
        cx="80"
        cy="110"
        rx="66"
        ry="96"
        stroke="url(#topo-zero-stroke)"
        strokeWidth="22"
      />

      <g className="origin-center [transform-box:fill-box] motion-safe:animate-[spin_60s_linear_infinite]">
        {RINGS.map(({ cx, cy, rx, ry, rotate }, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            stroke="url(#topo-zero-stroke)"
            strokeWidth="1.5"
            opacity={0.35 + i * 0.1}
          />
        ))}
      </g>

      <circle
        cx={PEAK.cx}
        cy={PEAK.cy}
        r="9"
        className="origin-center fill-sky-300/40 [transform-box:fill-box] motion-safe:animate-ping"
      />
      <circle
        cx={PEAK.cx}
        cy={PEAK.cy}
        r="5"
        className="fill-sky-500 dark:fill-sky-300"
      />
    </svg>
  )
}
