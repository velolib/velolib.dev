"use client"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"

export interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const navItems = [
    { label: "Home", id: "home", href: "/#home" },
    { label: "Blog", id: "blog", href: "/blog" },
    { label: "Reviews", id: "reviews", href: "/reviews" },
    { label: "Projects", id: "projects", href: "/projects" },
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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink render={<Link href={item.href} />}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <ModeToggle />

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="md:hidden" size="icon">
                <Menu className="size-4.5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <div className="mt-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    render={<Link href={item.href} />}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  )
}
