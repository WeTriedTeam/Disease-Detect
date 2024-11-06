'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Package2, Bell, Home, Bot } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "./button";

export const Sidebar = () => {

      const pathname = usePathname();

     return(
          <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">WeTried Team</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary
                ${pathname === '/dashboard' ? 'text-primary bg-muted' : 'text-muted-foreground'}`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"><Bot className="h-5 w-5"/> AI Diagnosis</AccordionTrigger>
                    <AccordionContent>
                      <ul>
                        <li className="hover:text-primary hover:bg-muted">
                          <Link
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground  transition-all hover:text-primary"
                          href="/view-diagnosis">
                            View Diagnosis
                          </Link>
                        </li>

                        <li className="hover:text-primary hover:bg-muted">
                          <Link 
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary "
                          href="/ai-diagnose">
                              Upload image for Diagnose
                          </Link>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
              </Accordion>
            </nav>
          </div>
        </div>
     );
}