"use client";
import { deleteCookies } from "@/app/(actions)/delete-cookies";
import { fetchRandomChapter } from "@/app/(actions)/get-random-chapter";
import { getWordsGuess } from "@/app/(actions)/get-words-guess";
import { submitWord as actionSubmitWord } from "@/app/(actions)/submit-word";
import { submitWordGospel as actionSubmitWordGospel } from "@/app/(actions)/submit-word";
import { CensorChapter, WordsGuess } from "@/types";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface UseGameLogicProps {
  isGospel: boolean;
}

export const useGameLogic = ({ isGospel }: UseGameLogicProps) => {
  const [randomChapter, setRandomChapter] = useState<(CensorChapter & { win?: boolean }) | null>(null);
  const [wordsGuess, setWordsGuess] = useState<WordsGuess | null>(null);
  const [inputWord, setInputWord] = useState<string>("");
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [wordsState, submitWord] = useFormState(isGospel ? actionSubmitWordGospel : actionSubmitWord, null);

  const fetchChapterData = async () => {
    try {
      const [chapter, guessedWords] = await Promise.all([
        fetchRandomChapter(isGospel),
        getWordsGuess(isGospel),
      ]);
      setRandomChapter(chapter);
      setWordsGuess(guessedWords);
    } catch (error) {
      console.error("Error fetching chapter data:", error);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [isGospel]);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      await submitWord(formData);
      await fetchChapterData();
      setInputWord("");
      setSelectedGuess(formData.get("word")?.toString() ?? "");
    } catch (error) {
      console.error("Error submitting word:", error);
    }
  };

  const handleReestart = async () => {
    setRandomChapter(null);
    setWordsGuess(null);
    await deleteCookies(isGospel);
    await fetchChapterData();
    setSelectedGuess(null);
  };

  return {
    randomChapter,
    wordsGuess,
    inputWord,
    setInputWord,
    selectedGuess,
    setSelectedGuess,
    wordsState,
    handleFormSubmit,
    handleReestart
  };
};
