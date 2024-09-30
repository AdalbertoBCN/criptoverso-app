import { CensorChapter, GetRandomChapterResponse, WordsGuess } from "@/types";
import { censorWord, splitTextIntoWords } from "./string";
import { whiteSquare } from "./utils";
import { getVariations } from "./getVariations";

export function censorChapterContent(
  randomChapter: GetRandomChapterResponse,
  wordsGuess: WordsGuess,
  giveUp: boolean
): CensorChapter & { countWordsGuess: WordsGuess; win?: boolean } {
  
  // Inicializa a contagem de palavras adivinhadas
  wordsGuess?.words.forEach((wordGuess) => {
    wordGuess.count = 0;
  });

  const wordsGuessArrayKeys = wordsGuess.words.map((word) => word.word.toLowerCase());

  // Pré-calcula as variações de todas as palavras adivinhadas
  const variationsPossibleWithGuess = Object.fromEntries(
    wordsGuessArrayKeys.map(wordGuess => [wordGuess, getVariations(wordGuess)])
  );

  const variationsPossible: string[] = wordsGuessArrayKeys.flatMap((wordGuess) => variationsPossibleWithGuess[wordGuess]);

  // Função auxiliar para incrementar a contagem de palavras adivinhadas
  const incrementWordGuessCount = (wordLower: string) => {
    Object.keys(variationsPossibleWithGuess).forEach((key) => {
      if (variationsPossibleWithGuess[key].includes(wordLower)) {
        const wordFind = wordsGuess.words.findIndex((guess) => guess.word.toLowerCase() === key);
        if (wordFind !== -1) {
          wordsGuess.words[wordFind].count += 1;
        }
      }
    });
  };

  // Censura o nome do livro
  const censuredTitle = splitTextIntoWords(randomChapter.bookName).map((word, index) => {
    if (index % 2 === 0) {
      const wordLower = word.toLowerCase();
      if (variationsPossible.includes(wordLower)) {
        incrementWordGuessCount(wordLower);
      }
      return censorWord(word, variationsPossible, false || giveUp);
    }
    return word;
  });

  // Censura o número do capítulo
  const chapterNumberStr = randomChapter.chapterNumber.toString();
  if (wordsGuessArrayKeys.includes(chapterNumberStr)) {
    const numberFind = wordsGuess.words.findIndex((guess) => guess.word === chapterNumberStr);
    if (numberFind !== -1) {
      wordsGuess.words[numberFind].count += 1;
    }
  }
  const censoredNumber = censorWord(chapterNumberStr, wordsGuessArrayKeys, false || giveUp);

  // Verifica se o jogador ganhou
  const win = giveUp || ![...censuredTitle, censoredNumber].join("").includes(whiteSquare);

  // Censura os versos do capítulo
  const censoredVerses = randomChapter.verses?.map((verse) => {
    return splitTextIntoWords(verse.text).map((word, index, all) => {
      const EvenOdd = all[0].match(/[\u00BF-\u1FFF\u2C00-\uD7FF\w]+/) ? 0 : 1;
      if (index % 2 === EvenOdd) {
        const wordLower = word.toLowerCase();
        if (variationsPossible.includes(wordLower)) {
          incrementWordGuessCount(wordLower);
        }
        return censorWord(word, variationsPossible, win);
      }
      return word;
    });
  });

  return {
    bookName: censuredTitle,
    chapterNumber: censoredNumber,
    verses: censoredVerses,
    countWordsGuess: wordsGuess,
    win,
  };
}
