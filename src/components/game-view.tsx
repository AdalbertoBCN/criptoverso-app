"use client";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { RotateCcw } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChapterContent from "./chapter-content";
import SubmitInput from "./submit-input";
import Spinner from "./spinner";
import ListGuesses from "./list-guesses";
import IF from "./if";
import { GiveUp } from "./give-up";

interface GameViewProps {
  isGospel: boolean;
  title: string;
}

export default function GameView({ isGospel, title }: GameViewProps) {
  const {
    randomChapter,
    selectedGuess,
    handleFormSubmit,
    setInputWord,
    inputWord,
    wordsGuess,
    setSelectedGuess,
    handleReestart,
    messageError,
    handleGiveUp,
    giveUp,
    isPending,
    setIsPending
  } = useGameLogic({ isGospel });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures that the component only runs certain logic on the client
  }, []);

  return (
    <div className="flex flex-col h-screen relative">
      <header className="h-16 flex items-center justify-between px-4 bg-foreground/10 dark:bg-foreground/5">
        <Logo />
        <h2 className="text-md font-semibold">
          {title}
          <RotateCcw
            className="size-5 inline-block ml-2 cursor-pointer"
            onClick={handleReestart}
          />
        </h2>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col">
            <ScrollArea className="px-4 h-[calc(100vh-8rem)]">
              {/* Ensure this content is rendered only on the client */}
              <div suppressHydrationWarning>
                {isClient && randomChapter ? (
                  <ChapterContent
                    randomChapter={randomChapter}
                    selectedGuess={selectedGuess}
                    giveUp={giveUp}
                  />
                ) : (
                  <Spinner />
                )}
              </div>
            </ScrollArea>
          </div>

          <footer className="h-40 bottom-0 left-0 grid grid-flow-col bg-foreground/10 dark:bg-foreground/5 px-4 py-3">
            <IF condition={isClient && !!randomChapter}>
              <>
                <SubmitInput
                  inputWord={inputWord}
                  handleFormSubmit={handleFormSubmit}
                  setInputWord={setInputWord}
                  win={randomChapter?.win}
                  giveUp={giveUp}
                  isPending={isPending}
                  setIsPending={setIsPending}
                />
                <IF condition={!giveUp && !randomChapter?.win}>
                  <GiveUp handleGiveUp={handleGiveUp} />
                </IF>
                <IF condition={giveUp}>
                  <span className="justify-self-center h-min text-lg">
                    Você desistiu...
                  </span>
                </IF>
                <IF condition={!!randomChapter?.win && !giveUp}>
                  <span className="justify-self-center h-min text-lg">
                    Parabéns, você acertou!
                  </span>
                </IF>
              </>
            </IF>
          </footer>
        </div>

        <aside className="w-48 bg-foreground/10 dark:bg-foreground/5" suppressHydrationWarning>
          {/* Ensure guesses list renders only when client is ready */}
          {isClient && randomChapter && (
            <>
            <ListGuesses
              wordsGuess={wordsGuess}
              setSelectedGuess={setSelectedGuess}
              messageError={messageError}
              selectedGuess={selectedGuess}
              isPending={isPending}
              />
              </>
          )}
        </aside>
      </main>
    </div>
  );
}
