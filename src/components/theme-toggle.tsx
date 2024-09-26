"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  function toggleDarkMode() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}

      className={cn("rounded-full hover:bg-primary/20")}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">
        {theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      </span>
    </Button>
  );
}