"use client"
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4">
        <h1 className="text-lg">
          Criptoverso
          <BookOpen className="size-6 inline-block ml-2" />
        </h1>
        <ThemeToggle />
      </header>

      {/* Main section with centered links */}
      <main className="flex flex-1 items-center justify-center gap-4">
        <Link href="/aleatorio">
          <Button className="w-[30vw] h-[6vh] text-lg bg-foreground text-background hover:bg-foreground/90">Aleatório</Button>
        </Link>
        <Link href="/evangelhos">
          <Button className="w-[30vw] h-[6vh] text-lg bg-foreground text-background hover:bg-foreground/90">Evangelhos</Button>
        </Link>
      </main>
    </div>
  );
}
