import { CensorChapter, GetRandomChapterResponse, WordsGuess } from "@/types";
import { censorWord, splitTextIntoWords } from "./string";
import { whiteSquare } from "./utils";

export function censorChapterContent(
  randomChapter: GetRandomChapterResponse,
  wordsGuess?: string
): CensorChapter & { countWordsGuess: WordsGuess; win?: boolean } {

  const wordsGuessParsed: WordsGuess = JSON.parse(wordsGuess || '{ "words": [] }');
  
  // Inicializa a contagem de palavras adivinhadas
  wordsGuessParsed?.words.forEach((wordGuess) => {
    wordGuess.count = 0;
  });

  const wordsGuessArrayKeys = wordsGuessParsed.words.map((word) => word.word.toLowerCase());

  // Censura o nome do livro
  const censuredTitle = splitTextIntoWords(randomChapter.bookName).map((word, index) => {
    if (index % 2 === 0) {
      const wordLower = word.toLowerCase();
      if (wordsGuessArrayKeys.includes(wordLower)) {
        const wordFind = wordsGuessParsed.words.findIndex((wordGuess) => wordGuess.word.toLowerCase() === wordLower);
        if (wordFind !== -1) {
          wordsGuessParsed.words[wordFind].count += 1;
        }
      }
      return censorWord(word, wordsGuessArrayKeys, false);
    }
    return word;
  });

  // Censura o número do capítulo
  const chapterNumberStr = randomChapter.chapterNumber.toString();

  if (wordsGuessArrayKeys.includes(chapterNumberStr)) {
    const numberFind = wordsGuessParsed.words.findIndex((wordGuess) => wordGuess.word === chapterNumberStr);
    if (numberFind !== -1) {
      wordsGuessParsed.words[numberFind].count += 1;
    }
  }

  const censoredNumber = censorWord(chapterNumberStr, wordsGuessArrayKeys, false);

  // Verifica se o jogador ganhou
  const win = ![...censuredTitle, censoredNumber].join("").includes(whiteSquare);

  // Censura os versos do capítulo
  const censoredVerses = randomChapter.verses?.map((verse) => {
    return splitTextIntoWords(verse.text).map((word, index, all) => {
      const EvenOdd = all[0].match(/[\u00BF-\u1FFF\u2C00-\uD7FF\w]+/) ? 0 : 1;

      if (index % 2 === EvenOdd) {
        const wordLower = word.toLowerCase();
        const censoredWord = censorWord(word, wordsGuessArrayKeys, win);
        
        // Atualiza a contagem de palavras adivinhadas
        if (wordsGuessArrayKeys.includes(wordLower)) {
          const wordFind = wordsGuessParsed.words.findIndex((wordGuess) => wordGuess.word.toLowerCase() === wordLower);
          if (wordFind !== -1) {
            wordsGuessParsed.words[wordFind].count += 1;
          }
        }
        return censoredWord;
      }
      return word;
    });
  });

  return {
    bookName: censuredTitle,
    chapterNumber: censoredNumber,
    verses: censoredVerses,
    countWordsGuess: wordsGuessParsed,
    win,
  };
}
