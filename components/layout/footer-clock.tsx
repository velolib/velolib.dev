"use client"

import { useEffect, useState } from "react"

export function FooterClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    })
    const tick = () => setTime(formatter.format(new Date()))
    tick()

    let interval: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(
      () => {
        tick()
        interval = setInterval(tick, 60_000)
      },
      60_000 - (Date.now() % 60_000)
    )

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [timeZone])

  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  )
}
