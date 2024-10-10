'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Package2, Bell, Home, Bot } from "lucide-react";
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
              <Link
                href="/ai-diagnose"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/ai-diagnose' ? 'bg-muted text-primary' : 'text-muted-foreground' }
                  transition-all hover:text-primary`}
              >
                <Bot className="h-4 w-4" />
                AI Dianosis
              </Link>
            </nav>
          </div>
        </div>
     );
}