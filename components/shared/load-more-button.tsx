import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function LoadMoreButton({
  onClick,
  pending = false,
  shown,
  total,
  children,
}: {
  onClick: () => void
  pending?: boolean
  shown: number
  total: number
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={pending}
        className="btn-brand group relative border-transparent hover:bg-sky-300/10"
      >
        {children}
        {pending ? (
          <Spinner className="text-sky-600 dark:text-sky-300" />
        ) : (
          <ChevronDown className="transition-transform group-hover:translate-y-0.5" />
        )}
      </Button>
      <p className="font-mono text-xs text-muted-foreground">
        {shown} / {total}
      </p>
    </div>
  )
}
