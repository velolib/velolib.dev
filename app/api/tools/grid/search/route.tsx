import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const TMDB_TOKEN = process.env.TMDB_TOKEN
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const type = searchParams.get("type")

    // Validate query
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      )
    }

    // Validate media type
    if (type !== "tv" && type !== "movie") {
      return NextResponse.json(
        { error: 'Type must be either "tv" or "movie"' },
        { status: 400 }
      )
    }

    // Ensure API key is configured
    if (!TMDB_TOKEN) {
      return NextResponse.json(
        { error: "TMDB_TOKEN not configured" },
        { status: 500 }
      )
    }

    // Search TMDB
    const response = await axios.get(`${TMDB_BASE_URL}/search/${type}`, {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page: 1,
        api_key: TMDB_TOKEN,
      },
    })

    const results = response.data.results || []

    const medias = results.map(
      (media: {
        id: string
        title?: string
        name?: string
        overview: string
        poster_path: string | null
        release_date?: string
        first_air_date?: string
      }) => {
        const date =
          type === "movie" ? media.release_date : media.first_air_date

        return {
          id: media.id.toString(),
          name: type === "movie" ? (media.title ?? "") : (media.name ?? ""),
          overview: media.overview,
          posterPath: media.poster_path
            ? `https://image.tmdb.org/t/p/original${media.poster_path}`
            : "",
          year: date ? new Date(date).getFullYear() : undefined,
        }
      }
    )

    return NextResponse.json({ results: medias })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB Search Error:", error.response?.data ?? error.message)
    } else {
      console.error("TMDB Search Error:", error)
    }

    return NextResponse.json(
      { error: "Failed to search media" },
      { status: 500 }
    )
  }
}
