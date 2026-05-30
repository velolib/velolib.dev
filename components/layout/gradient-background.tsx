interface GradientBackgroundProps {
  inverted?: boolean
}

export default function GradientBackground({
  inverted,
}: GradientBackgroundProps) {
  return (
    <>
      {!inverted ? (
        <>
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-t from-transparent to-sky-300/10" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-linear-to-t from-sea-300/10 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-t from-transparent to-sea-300/10" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-80 bg-linear-to-t from-sky-300/10 to-transparent" />
        </>
      )}
    </>
  )
}
