"use client"
import { BookOpen, RotateCcw } from "lucide-react";
import Link from "next/link";

interface LogoProps {
    handleReestart: () => Promise<void>
}

export default function Logo({ handleReestart }: LogoProps) {
    return (
        <>
        <Link href="/">
          <h1 className="text-lg">
            Criptoverso
            <BookOpen className="size-6 inline-block ml-2" />
          </h1>
        </Link>

        <h2 className="text-md font-semibold">
          Evangelhos
          <RotateCcw className="size-5 inline-block ml-2 cursor-pointer" onClick={handleReestart} />
        </h2>
        </>
    );
}