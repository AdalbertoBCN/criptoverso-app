"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  // Função para alternar entre os modos claro, escuro e sistema
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("rounded-full hover:bg-primary/20")}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">
        {theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      </span>
    </Button>
  );
}
