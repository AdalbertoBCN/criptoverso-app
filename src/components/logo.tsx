"use client"
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function Logo() {
    return (
        <>
        <Link href="/">
          <h1 className="text-lg">
            Criptoverso
            <BookOpen className="size-6 inline-block ml-2" />
          </h1>
        </Link>
        </>
    );
}