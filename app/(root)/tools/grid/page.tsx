import { GridMaker } from "@/components/tools/grid/grid-maker"
import { buildOgImageUrl, buildPageMetadata } from "@/lib/seo"
import { Metadata } from "next"

export const metadata: Metadata = buildPageMetadata({
  title: "Media grid",
  description:
    "Create a 3×3 grid of your favorite media and share it with others.",
  pathname: "/tools/grid",
  keywords: [
    "media grid",
    "share media",
    "velolib",
    "movie grid",
    "tv show grid",
    "anime grid",
  ],
  image: buildOgImageUrl({
    title: "Media grid",
    description:
      "Create a 3×3 grid of your favorite media and share it with others.",
    eyebrow: "Tools",
  }),
})

export default async function Page() {
  return (
    <>
      <GridMaker />
    </>
  )
}
