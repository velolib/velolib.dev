interface GradientBackgroundProps {
  inverted?: boolean
}

export default function GradientBackground({
  inverted,
}: GradientBackgroundProps) {
  const top = inverted ? "var(--color-sea-300)" : "var(--color-sky-300)"
  const bottom = inverted ? "var(--color-sky-300)" : "var(--color-sea-300)"

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-15 dark:opacity-10"
      style={{
        // Cap each glow at half the section height so short sections don't
        // have the top and bottom glows overlapping in the middle.
        backgroundImage: `radial-gradient(ellipse 80% min(420px, 50%) at 50% 0%, ${top}, transparent 70%), radial-gradient(ellipse 80% min(380px, 50%) at 50% 100%, ${bottom}, transparent 70%)`,
      }}
    />
  )
}
