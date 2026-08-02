"use client"

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
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

export interface NavigationProps {
  className?: string
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center justify-start gap-1.5 leading-none font-medium">
                {" "}
                <Icon className="size-4.5" /> {title}
              </div>
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  )
}

export function Navigation({ className }: NavigationProps) {
  const navItems = [
    { label: "Home", id: "home", href: "/#home", icon: House },
    { label: "Blog", id: "blog", href: "/blog", icon: BookOpenText },
    { label: "Reviews", id: "reviews", href: "/reviews", icon: NotebookPen },
    { label: "Projects", id: "projects", href: "/projects", icon: Code },
    {
      label: "Tools",
      id: "tools",
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

  return (
    <nav className={cn("w-full border-b", className)}>
      <div className="container mx-auto flex h-(--nav-height) items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="">
          <Link
            href="/#home"
            className="text-brand font-serif text-xl font-bold sm:text-2xl"
          >
            velolib.dev
          </Link>
          <span className="ml-2 text-xs text-foreground sm:text-sm">
            by <span className="text-sky-300">malik</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => {
                if (!item.children) {
                  return (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink render={<Link href={item.href} />}>
                        <item.icon className="size-4.5" />
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                } else {
                  return (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuTrigger>
                        <item.icon className="mr-1.5 size-4.5" /> {item.label}
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
                }
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <ModeToggle />

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" className="lg:hidden" size="icon">
                  <Menu className="size-4.5" />
                </Button>
              }
            />
            <SheetContent className="p-4" side="left">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  if (!item.children) {
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        render={<Link href={item.href} />}
                        className="w-full items-center justify-start"
                      >
                        <item.icon className="size-4.5" />
                        {item.label}
                      </Button>
                    )
                  }
                  return (
                    <Collapsible key={item.id}>
                      <CollapsibleTrigger
                        render={
                          <Button variant="ghost" className="w-full">
                            <item.icon className="size-4.5" /> {item.label}
                            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                          </Button>
                        }
                      />
                      <CollapsibleContent className="flex flex-col gap-2 pl-4">
                        {item.children.map((child) => (
                          <Button
                            key={child.id}
                            variant="ghost"
                            render={<Link href={child.href} />}
                            nativeButton={false}
                            className="w-full items-center justify-start"
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
    </nav>
  )
}
