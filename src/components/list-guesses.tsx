"use client"
import { cn } from "@/lib/utils";
import { WordsGuess } from "@/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalize } from "@/lib/string";
import { Dispatch, SetStateAction } from "react";

interface ListGuessesProps {
  wordsGuess: WordsGuess | null;
  setSelectedGuess: Dispatch<SetStateAction<string | null>>;
  wordsState: {
    error: {
      message: string[] | undefined;
    };
  } | null | undefined;
  selectedGuess: string | null;
}

export default function ListGuesses({
  wordsGuess,
  setSelectedGuess,
  wordsState,
  selectedGuess,
}: ListGuessesProps) {
  const length = wordsGuess?.words.length;

  return (
    <>
      {wordsGuess && wordsGuess.words && (
        <>
          <h2 className="px-4 pb-1 border-b-2 border-foreground/40">
            {length} Tentativas
          </h2>
          {wordsGuess && wordsState?.error?.message && wordsState.error.message[0].length > 0 && (
            <div className="text-sm text-center px-1 py-2 bg-destructive/15 text-destructive">
              {wordsState.error.message.join(", ")}
            </div>
          )}
          <ToggleGroup
            type="single"
            className="flex flex-col-reverse p-0"
            value={selectedGuess ?? ""}
            onValueChange={setSelectedGuess}
          >
            {wordsGuess.words.map((word) => (
            
              <ToggleGroupItem
                value={word.word}
                key={word.word}
                className={cn(
                  "w-full font-semibold rounded-none p-2 flex justify-between transition-colors",
                  "data-[state=on]:bg-primary/30 data-[state=on]:text-primary-foreground", // Estilo para o item selecionado
                  {
                    "text-success": word.count > 0,
                    "text-destructive": word.count < 1,
                    "dark:text-success data-[state=on]:text-success": word.count > 0,
                    "dark:text-destructive data-[state=on]:text-destructive": word.count < 1,
                  }
                )}
              >
                <span>
                  {["deus", "jesus"].includes(word.word)
                    ? capitalize(word.word)
                    : word.word}
                </span>
                <span>{word.count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </>
      )}
    </>
  );
}
