import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

export const getMDXSlug = (slug: string) => slug.replace(/\.(md|mdx)$/i, "")

export const formatDateRange = (startDate: Date, finishDate: Date): string => {
  const start = formatDate(startDate)
  const end = formatDate(finishDate)
  return `${start} – ${end}`
}

export const formatCompactDateRange = (
  startDate: Date,
  finishDate: Date
): string => {
  const formatter = new Intl.DateTimeFormat("en", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })

  return `${formatter.format(startDate)} - ${formatter.format(finishDate)}`
}
