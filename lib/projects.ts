export interface Project {
  slug: string
  title: string
  kind: string
  description: string
  image: string
  imageAlt: string
  href: string
}

export const PROJECTS: Project[] = [
  {
    slug: "radial",
    title: "Radial",
    kind: "Minecraft Mod",
    description:
      "A simple and opinionated Minecraft radial menu mod for Fabric.",
    image: "/images/projects/radial.webp",
    imageAlt: "Radial project",
    href: "https://modrinth.com/mod/radial",
  },
  {
    slug: "8sched",
    title: "8Sched",
    kind: "Web App",
    description:
      "A simple web app that compiles SMA Negeri 8 Jakarta's class schedules into an easy-to-use website.",
    image: "/images/projects/8sched.webp",
    imageAlt: "8Sched project",
    href: "https://8sched.velolib.dev",
  },
  {
    slug: "whatlas",
    title: "whatlas",
    kind: "Web App",
    description:
      "React web application that provides analytical insights for WhatsApp chat data.",
    image: "/images/projects/whatlas.webp",
    imageAlt: "whatlas project",
    href: "https://whatlas.velolib.dev",
  },
  {
    slug: "vinth",
    title: "vinth",
    kind: "CLI Tool",
    description:
      "Minecraft mod manager written in Go that tracks modrinth mods using a lockfile.",
    image: "/images/projects/vinth.webp",
    imageAlt: "vinth project",
    href: "https://github.com/velolib/vinth",
  },
  {
    slug: "valolab",
    title: "valolab",
    kind: "Web App",
    description: "Simple agent composition visualizer for VALORANT",
    image: "/images/projects/valolab.webp",
    imageAlt: "valolab project",
    href: "https://valolab.velolib.dev",
  },
  {
    slug: "xinde",
    title: "xinde - new tab",
    kind: "Browser Extension",
    description:
      "Simply a no nonsense new tab extension for Chromium browsers.",
    image: "/images/projects/xinde.webp",
    imageAlt: "xinde project",
    href: "https://github.com/velolib/xinde",
  },
]
