import { SectionShell } from "@/components/shared/section-shell"
import { ProjectCard } from "@/components/projects/project-card"
import { SECTIONS } from "@/lib/sections"
import { PROJECTS } from "@/lib/projects"
import GradientBackground from "@/components/layout/gradient-background"
import type { Metadata } from "next"
import { buildOgImageUrl, buildPageMetadata } from "@/lib/seo"
import { PageScroller } from "@/components/layout/page-scroller"

export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Explore projects built by velolib, from web tools to open-source experiments.",
  pathname: "/projects",
  keywords: ["projects", "portfolio", "open source", "velolib"],
  image: buildOgImageUrl({
    title: SECTIONS.projects.title,
    description: SECTIONS.projects.description,
    eyebrow: SECTIONS.projects.eyebrow,
  }),
})

export default function ProjectsPage() {
  return (
    <PageScroller>
      <SectionShell
        id="projects"
        title={SECTIONS.projects.title}
        eyebrow={SECTIONS.projects.eyebrow}
        description={SECTIONS.projects.description}
      >
        <GradientBackground inverted />
        <div className="min-h-0 flex-1">
          <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                kind={project.kind}
                description={project.description}
                image={project.image}
                imageAlt={project.imageAlt}
                href={project.href}
              />
            ))}
          </div>
        </div>
      </SectionShell>
    </PageScroller>
  )
}
