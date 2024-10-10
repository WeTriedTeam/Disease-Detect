'use client'

import Link from "next/link"
import { Package2, Home, Menu, Bot } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"


export const SidebarMobile = () => {
     const pathname = usePathname();

     return(
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">WeTried Team</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`
                    mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground
                    ${pathname === '/dashboard' ? 'text-foreground bg-muted': 'text-muted-foreground'}`}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/ai-diagnose"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground
                    ${pathname === '/ai-diagnose' ? 'text-foreground bg-muted': 'text-muted-foreground'}`}
                >
                  <Bot className="h-5 w-5" />
                  AI Diagnosis
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
     )
}