"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"
import { Wordmark } from "./wordmark"
import { Button } from "../ui/button"
import {
  BookOpenText,
  Brush,
  ChevronDownIcon,
  Code,
  Grid3X3,
  House,
  Menu,
  NotebookPen,
} from "lucide-react"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"

export interface NavigationProps {
  className?: string
}

type NavIcon = React.ComponentType<{ className?: string }>

interface NavChild {
  label: string
  id: string
  href: string
  description: string
  icon: NavIcon
}

type NavItem = { label: string; id: string; icon: NavIcon } & (
  | { href: string; match: string; children?: undefined }
  | { href?: undefined; match: string; children: NavChild[] }
)

const navItems: NavItem[] = [
  { label: "Home", id: "home", href: "/#home", match: "/", icon: House },
  {
    label: "Blog",
    id: "blog",
    href: "/blog",
    match: "/blog",
    icon: BookOpenText,
  },
  {
    label: "Reviews",
    id: "reviews",
    href: "/reviews",
    match: "/reviews",
    icon: NotebookPen,
  },
  {
    label: "Projects",
    id: "projects",
    href: "/projects",
    match: "/projects",
    icon: Code,
  },
  {
    label: "Tools",
    id: "tools",
    match: "/tools",
    icon: Brush,
    children: [
      {
        label: "Media grid",
        id: "media-grid",
        href: "/tools/grid",
        description: "Create and share a grid of your favorite media.",
        icon: Grid3X3,
      },
    ],
  },
]

function isActive(pathname: string, match: string) {
  if (match === "/") return pathname === "/"
  return pathname === match || pathname.startsWith(`${match}/`)
}

const desktopItemClass =
  "relative h-9 rounded-xl px-3 py-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground focus:bg-muted/60 data-open:bg-muted/60 data-popup-open:bg-muted/60"

function ActiveUnderline() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      layoutId="nav-underline"
      aria-hidden
      className="absolute inset-x-3 -bottom-[calc((var(--nav-height)-2.25rem)/2)] h-0.5 rounded-full bg-linear-to-r from-sky-300 to-sea-300 shadow-[0_0_12px_var(--color-sky-300)]"
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 500, damping: 40 }
      }
    />
  )
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string
  icon: NavIcon
  title: string
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        className="group/item items-start gap-3"
        render={
          <Link href={href}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-700 transition-colors group-hover/item:bg-sky-500/15 dark:text-sky-300">
              <Icon className="size-4.5" />
            </span>
            <span className="flex flex-col gap-1 text-sm">
              <span className="leading-none font-medium">{title}</span>
              <span className="line-clamp-2 text-muted-foreground">
                {children}
              </span>
            </span>
          </Link>
        }
      />
    </li>
  )
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)
  const closeSheet = () => setSheetOpen(false)

  return (
    <nav
      className={cn(
        "relative z-40 w-full bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/55",
        className
      )}
    >
      <div className="container mx-auto flex h-(--nav-height) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <div className="flex items-center gap-1">
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-0.5">
              {navItems.map((item) => {
                const active = isActive(pathname, item.match)

                if (!item.children) {
                  return (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        className={cn(desktopItemClass, {
                          "text-foreground": active,
                        })}
                        render={
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                      >
                        <item.icon className="size-4" />
                        {item.label}
                        {active && <ActiveUnderline />}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                }

                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuTrigger
                      className={cn(desktopItemClass, "font-normal", {
                        "text-foreground": active,
                      })}
                    >
                      <item.icon className="mr-1.5 size-4" /> {item.label}
                      {active && <ActiveUnderline />}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                        {item.children.map((child) => (
                          <ListItem
                            key={child.id}
                            title={child.label}
                            href={child.href}
                            icon={child.icon}
                          >
                            {child.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <span
            aria-hidden
            className="mx-2 hidden h-5 w-px bg-border lg:block"
          />

          <ModeToggle />

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" className="lg:hidden" size="icon">
                  <Menu className="size-4.5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent className="gap-0 p-0" side="left">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="relative flex h-(--nav-height) items-center px-4">
                <Wordmark onClick={closeSheet} />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-sky-300/70 to-sea-300/0"
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.match)
                  const rowClass = cn(
                    "relative w-full items-center justify-start text-muted-foreground hover:text-foreground",
                    active &&
                      "bg-sky-500/10 text-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-sky-300 before:to-sea-300"
                  )

                  if (!item.children) {
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        render={
                          <Link
                            href={item.href}
                            onClick={closeSheet}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                        nativeButton={false}
                        className={rowClass}
                      >
                        <item.icon className="size-4.5" />
                        {item.label}
                      </Button>
                    )
                  }
                  return (
                    <Collapsible key={item.id} defaultOpen={active}>
                      <CollapsibleTrigger
                        render={
                          <Button variant="ghost" className={rowClass}>
                            <item.icon className="size-4.5" /> {item.label}
                            <ChevronDownIcon className="ml-auto transition-transform group-data-panel-open/button:rotate-180" />
                          </Button>
                        }
                      />
                      <CollapsibleContent className="mt-1 flex flex-col gap-1 pl-4">
                        {item.children.map((child) => (
                          <Button
                            key={child.id}
                            variant="ghost"
                            render={
                              <Link href={child.href} onClick={closeSheet} />
                            }
                            nativeButton={false}
                            className={cn(
                              "w-full items-center justify-start text-muted-foreground hover:text-foreground",
                              isActive(pathname, child.href) &&
                                "text-foreground"
                            )}
                          >
                            <child.icon className="size-4.5" />
                            {child.label}
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-(image:--nav-hairline) opacity-80"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] -bottom-1 h-2 bg-(image:--nav-hairline) opacity-30 blur-md"
      />
    </nav>
  )
}
