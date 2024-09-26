"use client"
import { CensorChapter } from "@/types";
import { WordComponent } from "./word";
import { transparentSquare } from "@/lib/utils";

interface ChapterContentProps {
  randomChapter: (CensorChapter & { win?: boolean }) | null;
  selectedGuess: string | null;
}

export default function ChapterContent({
  randomChapter,
  selectedGuess,
}: ChapterContentProps) {
  return (
    <div className="flex flex-col gap-4 pb-4 pt-2"> 
      {randomChapter?.win && (
        <div className="w-full h-28 bg-success text-background text-lg rounded-lg flex items-center justify-center">
            Você acertou!
        </div>
      )}

      <span className="text-xl">
      {randomChapter?.bookName.map((bookName, index) => (
          <WordComponent
            key={bookName}
            word={bookName}
            index={index}
            selectedGuess={selectedGuess}
          />
        ))}
      {transparentSquare}
      {randomChapter && <WordComponent word={randomChapter.chapterNumber.toString()} index={0} selectedGuess={selectedGuess} />}
      </span>
      <div>

      {randomChapter?.verses?.map((verse, key) => (
        <p key={key} data-verse={key + 1} className="flex flex-wrap items-start text-md tracking-tight leading-snug before:content-[attr(data-verse)] before:font-normal before:tracking-tight before:font-mono before:text-sm ml-8 before:-translate-x-8 before:absolute relative">
          {verse.map((word, index) => (
            <WordComponent
            key={index}
            word={word}
            index={index}
            selectedGuess={selectedGuess}
            />
          ))}
        </p>
      ))}
      </div>
    </div>
  );
}
