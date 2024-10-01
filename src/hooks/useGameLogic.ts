import { useEffect, useState } from "react";
import { deleteCookies } from "@/app/(actions)/delete-cookies";
import { fetchRandomChapter } from "@/app/(actions)/get-random-chapter";
import {
  submitWord as actionSubmitWord,
  submitWordGospel as actionSubmitWordGospel,
} from "@/app/(actions)/submit-word";
import { getwordsGuessStorageName, raise } from "@/lib/utils";
import { CensorChapter, WordsGuess } from "@/types";
import { useLocalStorage } from "usehooks-ts";
import useGiveUp from "./useGiveUp";

interface UseGameLogicProps {
  isGospel: boolean;
}

export const useGameLogic = ({ isGospel }: UseGameLogicProps) => {
  const [wordsGuess, setWordsGuess, removeWordsGuess] = useLocalStorage<WordsGuess>(
    getwordsGuessStorageName(isGospel),
    { words: [] }
  );

  const [randomChapter, setRandomChapter] = useState<(CensorChapter & { win?: boolean }) | null>(null);
  const [inputWord, setInputWord] = useState<string>("");
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const actionSubmit = isGospel ? actionSubmitWordGospel : actionSubmitWord;
  const [messageError, setMessageError] = useState<string | undefined>();
  const { giveUp, handleGiveUp, removeGiveUp } = useGiveUp(isGospel);

  const fetchChapterData = async (wordsGuessForm: WordsGuess) => {
    try {
      const chapter = await fetchRandomChapter(isGospel, wordsGuessForm, giveUp);
      if (!chapter) {
        throw new Error("Received null chapter data");
      }
      setRandomChapter(chapter);
      setWordsGuess(chapter.countWordsGuess);
      if (chapter.win) {
        setSelectedGuess(null);
      }
    } catch {
      console.error("Error fetching chapter data");
    }
  };
  

  // Chama a função ao montar o componente pela primeira vez
  useEffect(() => {
    fetchChapterData(wordsGuess);
  }, []);

  useEffect(() => {
    fetchChapterData(wordsGuess);
  }, [isGospel, giveUp]);

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("word", inputWord);

      const response = await actionSubmit(wordsGuess, formData);

      if (response.wordsGuess) {
        await fetchChapterData(response.wordsGuess);
        setMessageError(undefined);
      } else {
        setMessageError(response.error);
        if (response.error === "Você já tentou essa palavra") {
          setWordsGuess((prev) => raise(prev, inputWord));
        }
      }

      setInputWord("");
      setSelectedGuess(formData.get("word")?.toString() ?? "");
    } catch (error) {
      console.error("Error submitting word:", error);
    }
  };

  const handleReestart = async () => {
    removeWordsGuess(); // Remova as palavras
    setRandomChapter(null);
    setSelectedGuess(null);
    await deleteCookies(isGospel);
    removeGiveUp(); 
    window.location.reload();
  };

  return {
    randomChapter,
    wordsGuess,
    inputWord,
    setInputWord,
    selectedGuess,
    messageError,
    setSelectedGuess,
    handleFormSubmit,
    handleReestart,
    handleGiveUp,
    giveUp,
  };
};
