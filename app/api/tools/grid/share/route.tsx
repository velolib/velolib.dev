import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import Cloudflare from "cloudflare"
import Hashids from "hashids"

const hashids = new Hashids(process.env.HASHIDS_SALT!, 6)

const client = new Cloudflare({
  apiToken: process.env.CF_API_TOKEN!,
})
const accountId = process.env.CF_ACCOUNT_ID!
const databaseId = process.env.CF_D1_DATABASE_ID!

const GridDataSchema = z.object({
  medias: z
    .array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          posterUrl: z.string(),
          label: z.string().max(20),
          type: z.string(),
        })
        .nullable()
    )
    .length(9),
  showTitles: z.boolean(),
  showLabels: z.boolean(),
  isSquare: z.boolean(),
  createdAt: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const gridData = GridDataSchema.parse(body)

    if (!gridData.medias.some((media) => media !== null)) {
      return NextResponse.json(
        { error: "Grid must contain at least one show" },
        { status: 400 }
      )
    }

    const trustedDomains = ["image.tmdb.org"]
    for (const media of gridData.medias) {
      if (media) {
        const url = new URL(media.posterUrl)
        if (!trustedDomains.some((domain) => url.hostname.includes(domain))) {
          return NextResponse.json(
            { error: "Invalid poster URL source" },
            { status: 400 }
          )
        }
      }
    }

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

    const response = await client.d1.database.query(databaseId, {
      account_id: accountId,
      sql: "INSERT INTO grids (data, expires_at) VALUES (?, ?) RETURNING id",
      params: [JSON.stringify(gridData), expiresAt.toString()],
    })

    const row = response.result?.[0]?.results?.[0] as { id: number } | undefined
    const dbId = row?.id

    if (dbId === undefined) {
      throw new Error("D1 failed to return an ID")
    }
    const shareId = hashids.encode(dbId)

    if (!shareId) {
      throw new Error("D1 failed to return an ID")
    }

    return NextResponse.json({
      shareId: shareId,
      expiresAt,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid grid data", details: error },
        { status: 400 }
      )
    }

    console.error("Share error:", error)
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 }
    )
  }
}
