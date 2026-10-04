import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "btn-brand group relative w-fit border-transparent hover:bg-sky-300/10"
      )}
    >
      <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
      {children}
    </Link>
  )
}
