"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/lib/theme-provider"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative w-10 h-10 rounded-xl border-border/50 bg-muted/50 backdrop-blur-sm hover:bg-muted/80 hover:border-border transition-all duration-300 hover:scale-105"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 rounded-xl border-border/50 bg-popover/95 backdrop-blur-xl"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="rounded-lg m-1 cursor-pointer hover:bg-accent/80 transition-colors duration-200"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="rounded-lg m-1 cursor-pointer hover:bg-accent/80 transition-colors duration-200"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-500" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="rounded-lg m-1 cursor-pointer hover:bg-accent/80 transition-colors duration-200"
        >
          <Monitor className="mr-2 h-4 w-4 text-purple-500" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
