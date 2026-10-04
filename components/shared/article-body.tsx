import Toc from "@/components/shared/toc"
import GradientBackground from "@/components/layout/gradient-background"

type TocEntry = {
  level: number
  text: string
  slug: string
}

export function ArticleBody({
  toc,
  children,
}: {
  toc: TocEntry[]
  children: React.ReactNode
}) {
  const hasToc = toc.length > 0

  return (
    <section
      id="content"
      className="relative snap-start overflow-x-clip py-10 md:py-14"
    >
      <GradientBackground inverted />
      <div className="container mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16 lg:px-8">
        {hasToc && (
          <div className="lg:hidden">
            <Toc toc={toc} variant="collapsible" />
          </div>
        )}
        <article className="prose max-w-3xl min-w-0 text-pretty prose-neutral dark:prose-invert prose-headings:scroll-mt-8 prose-headings:text-balance prose-h2:mt-14 prose-h2:mb-6 prose-h2:font-serif prose-h2:text-2xl prose-h2:leading-snug prose-h2:font-bold prose-h2:tracking-tight md:prose-h2:text-3xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-serif prose-h3:text-xl prose-h3:leading-snug prose-h3:font-semibold prose-h3:tracking-tight prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-sm prose-h4:font-semibold prose-h4:tracking-[0.2em] prose-h4:text-sky-600 prose-h4:uppercase dark:prose-h4:text-sky-300 prose-a:text-sky-600 prose-a:decoration-sky-300/50 prose-a:underline-offset-4 hover:prose-a:decoration-sky-300 dark:prose-a:text-sky-300 prose-img:rounded-2xl [&>h2:first-child]:mt-0">
          {children}
        </article>
        {hasToc && (
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <Toc toc={toc} />
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
