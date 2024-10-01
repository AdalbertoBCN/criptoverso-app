import { allWords } from "./allWords";

import { transparentSquare, whiteSquare } from "./utils";

export const getchapterCookieName = (isGospel: boolean) =>
  isGospel
    ? "current-random-chapter-gospel"
    : "current-random-chapter";
export const getwordsGuessCookieName = (isGospel: boolean) =>
  isGospel ? "words-guess-gospel" : "words-guess";

  export function splitTextIntoWords(text: string): string[] {
    const wordBoundaryRegex = /([^\u00BF-\u1FFF\u2C00-\uD7FF\w\n\r]*)?([\u00BF-\u1FFF\u2C00-\uD7FF\w]+)([^\u00BF-\u1FFF\u2C00-\uD7FF\w\n\r]*)/ig;
    const separatorRegex = /(\s+)/g;
    const removeSoftHyphenRegex = /\u00AD/g;

    text = text.replace(removeSoftHyphenRegex, "");
    text = text.replace(separatorRegex, transparentSquare);

    const matches = Array.from(text.matchAll(wordBoundaryRegex));
    const result: string[] = [];
  
    matches.forEach((match) => {
      if (match[1]) result.push(match[1]);
      if (match[2]) result.push(match[2]);
      if (match[3]) result.push(match[3]);
    });
  
    return result;
  }

  export function capitalize(wordToCapitalize: string): string {
    return wordToCapitalize.charAt(0).toUpperCase() + wordToCapitalize.slice(1);
  }

  export function censorWord(word: string, wordsGuessArrayKeys: string[], win: boolean): string {
    const wordLowerCase = word.toLowerCase();
    if (allWords.includes(wordLowerCase) || wordsGuessArrayKeys.includes(wordLowerCase) || win) {
      return word;
    } else {
      return whiteSquare.repeat(word.length);
    }
  }