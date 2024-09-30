"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  function ButtonDarkMode() {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn("rounded-full hover:bg-primary/20")}
      >
        <Moon size={20} />
        <span className="sr-only">Ativar modo escuro</span>
      </Button>
    );
  }

  if (!mounted) {
    return <div className="size-8 ml-2"/>;
  }

  function ButtonLightMode() {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={cn("rounded-full hover:bg-primary/20")}
      >
        <Sun size={20} />
        <span className="sr-only">Ativar modo claro</span>
      </Button>
    );
  }

  return (
    <div>
      {theme === "dark" ? <ButtonLightMode /> : <ButtonDarkMode />}
    </div>
  );
}