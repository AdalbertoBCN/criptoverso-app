export interface GetRandomChapterResponse {
  bookName: string;
  bookNumber: number;
  chapterNumber: number;
  verses: Verse[];
}

export interface Verse {
  verseNumber: number;
  text: string;
}

export interface CurrentRandomChapter {
  bookNumber: number;
  chapterNumber: number;
}

export interface CensorChapter {
  bookName: string[];
  chapterNumber: string;
  verses: string[][];
}

export interface WordsGuess {
  words: {
    word: string;
    count: number;
  }[]
}