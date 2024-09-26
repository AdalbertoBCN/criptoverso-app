"use client";

import { cn, whiteSquare } from "@/lib/utils";
import { useState } from "react";

type WordProps = {
  word: string;
  selectedGuess: string | null;
  index: number;
};

export function WordComponent({ word, selectedGuess }: WordProps) {
  const [showSize, setShowSize] = useState(false);

  function handleWordClick() {
    setShowSize(!showSize);
  }

  const isSelected = selectedGuess?.toLocaleLowerCase() === word.toLocaleLowerCase();
  const includesWhiteSquare = word.includes(whiteSquare);

  // Classes dinâmicas
  const spanClasses = cn("relative text-md", {
    "before:content-[attr(data-size)] before:absolute before:text-sm before:top-0.5 before:left-0.5  before:text-background before:font-normal before:tracking-tight before:font-mono":
      showSize && includesWhiteSquare,
    "cursor-pointer": includesWhiteSquare,
    "text-success": isSelected,
  });

  return (
    <>
      {word.includes(whiteSquare) ? (
        <span
          data-size={word.length}
          className={spanClasses}
          onClick={handleWordClick}
        >
          {word}
        </span>
      ) : (
        <span className={cn({
          "bg-success/60 font-extrabold": isSelected && !includesWhiteSquare,
        })}>{word}</span>
      )}
    </>
  );
}
