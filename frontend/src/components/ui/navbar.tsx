'use client'

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {PersonIcon } from "@radix-ui/react-icons"

export function NavbarComponent() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">Logo</span>
            </Link>
            <div className="hidden md:block ml-10">
              <Link
                href="/projects"
                className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
              >
                Projets
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/login">
              <Button variant="ghost" size="icon" className="ml-4">
                <PersonIcon className="h-5 w-5" />
                <span className="sr-only">Connexion</span>
              </Button>
            </Link>
          </div>
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-2">
                  <span className="sr-only">Ouvrir le menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/projects"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Projets
                  </Link>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
