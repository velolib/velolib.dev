import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export interface SectionShellProps {
  id: string
  eyebrow: string
  title: string
  description: string
  buttonHref?: string
  buttonText?: string
  children: React.ReactNode
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  buttonHref,
  buttonText,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className="relative min-h-[calc(100dvh-var(--nav-height))] snap-start snap-always overflow-x-hidden py-6"
    >
      <div className="container mx-auto flex min-h-0 flex-1 flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-medium tracking-[0.32em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h1 className="text-brand pb-2 font-serif text-5xl font-bold tracking-tight md:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {description}
            </p>
          </div>

          {buttonHref && buttonText && (
            <Link
              href={buttonHref}
              className={buttonVariants({ variant: "outline" })}
            >
              {buttonText}
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
