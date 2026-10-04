import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"
import { SectionDivider } from "./section-divider"

export interface SectionShellProps {
  id: string
  eyebrow: string
  title: string
  description: string
  buttonHref?: string
  buttonText?: string
  children: React.ReactNode
  className?: string
  compact?: boolean
  divider?: boolean
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  buttonHref,
  buttonText,
  children,
  className,
  compact = false,
  divider = false,
}: SectionShellProps) {
  return (
    <section
      id={divider ? undefined : id}
      className={cn(
        "relative min-h-[calc(100dvh-var(--nav-height))] overflow-x-clip py-6",
        divider
          ? "min-h-[calc(100dvh-var(--nav-height)+6rem)] pt-0"
          : "snap-start snap-always",
        className
      )}
    >
      <div className="container mx-auto flex min-h-0 flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {divider && <SectionDivider className="h-24" />}
        <div
          id={divider ? id : undefined}
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-6",
            divider && "snap-start snap-always pt-6"
          )}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
              compact={compact}
            />

            {buttonHref && buttonText && (
              <Link
                href={buttonHref}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "btn-brand group relative border-transparent hover:bg-sky-300/10"
                )}
              >
                {buttonText}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
