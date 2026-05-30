"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
    __spotify_iframe_api?: SpotifyIframeApi
  }
}

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement | null,
    options: {
      width?: string
      height?: string
      uri: string
      theme?: string
    },
    callback: (controller: SpotifyEmbedController) => void
  ) => void
}

type SpotifyEmbedController = {
  loadUri: (uri: string) => void
  destroy: () => void
}

type SpotifyEmbedProps = {
  uri: string
}

function SpotifyEmbed({ uri }: SpotifyEmbedProps) {
  const embedRef = useRef<HTMLDivElement | null>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)

  const [iframeApi, setIframeApi] = useState<SpotifyIframeApi | undefined>(
    undefined
  )

  useEffect(() => {
    if (window.__spotify_iframe_api) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIframeApi(window.__spotify_iframe_api)
      return
    }

    const scriptUrl = "https://open.spotify.com/embed/iframe-api/v1"

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`)

    if (!existingScript) {
      const script = document.createElement("script")
      script.src = scriptUrl
      script.async = true
      document.body.appendChild(script)
    }

    const prev = window.onSpotifyIframeApiReady

    window.onSpotifyIframeApiReady = (api) => {
      window.__spotify_iframe_api = api
      setIframeApi(api)

      if (typeof prev === "function") {
        try {
          prev(api)
        } catch {}
      }
    }

    return () => {
      window.onSpotifyIframeApiReady = prev
    }
  }, [])

  useEffect(() => {
    if (!iframeApi || !embedRef.current) {
      return
    }

    let destroyed = false

    iframeApi.createController(
      embedRef.current,
      {
        width: "100%",
        height: "152",
        uri,
      },
      (controller) => {
        if (destroyed) {
          controller.destroy()
          return
        }

        controllerRef.current = controller
      }
    )

    return () => {
      destroyed = true
      controllerRef.current?.destroy()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeApi])

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.loadUri(uri)
    }
  }, [uri])

  return (
    <div className="my-4 overflow-hidden rounded-lg bg-background">
      <div ref={embedRef} />
    </div>
  )
}

const DynamicSpotifyEmbed = dynamic(() => Promise.resolve(SpotifyEmbed), {
  ssr: false,
})

export { DynamicSpotifyEmbed as SpotifyEmbed }
