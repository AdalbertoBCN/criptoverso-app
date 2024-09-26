import { WordsGuess } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transparentSquare = "⠀";
export const whiteSquare = "█";;

export const getchapterCookieName = (isGospel:boolean) => isGospel ? "current-random-chapter-gospel" : "current-random-chapter";
export const getwordsGuessCookieName = (isGospel:boolean) => isGospel ? "words-guess-gospel" : "words-guess";

export function raise(arr:WordsGuess, key:string) {

  const index = arr.words.findIndex((word) => word.word.toLowerCase() === key.toLowerCase());

  //remove and return element
  const word = arr.words.splice(index, 1)[0];

  arr.words = [...arr.words, word];

  return arr;
  }
