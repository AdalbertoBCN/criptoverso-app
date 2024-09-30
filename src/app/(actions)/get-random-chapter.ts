"use server"
import { censorChapterContent } from "@/lib/censor-chapter";
import { decrypt, encrypt } from "@/lib/crypto";
import {
  getchapterStorageName,
} from "@/lib/utils";
import type { CensorChapter, CurrentRandomChapter, WordsGuess } from "@/types";
import { cookies as storedCookies } from "next/headers";
import { getChapter } from "@db/src/functions/get-chapter";
import { getRandomChapter } from "@db/src/functions/get-random-chapter";

// Função para obter e armazenar cookies
const getCookie = (cookieName: string) => {
  const cookies = storedCookies();
  return cookies.get(cookieName);
};

const setCookie = (cookieName: string, value: string | object, maxAgeInSeconds: number = 60 * 60 * 24 * 7) => {
  const cookies = storedCookies();
  cookies.set(cookieName, typeof value === 'string' ? value : JSON.stringify(value), { maxAge: maxAgeInSeconds, sameSite: "strict"});
};

// Função principal com princípios de SOLID e semântica melhorada
export async function fetchRandomChapter(isGospel: boolean, wordsGuess:WordsGuess, giveUp: boolean): Promise<CensorChapter & { win?: boolean, countWordsGuess:WordsGuess }> {
  const chapterCookieName = getchapterStorageName(isGospel);

  // Obtenção de cookies
  const storedChapterCookie = getCookie(chapterCookieName);

  // Se não há capítulo armazenado nos cookies, buscar da API
  if (!storedChapterCookie) {
    const randomChapter = await getRandomChapter({ isGospel});

    // Criptografar e armazenar o capítulo nos cookies
    const encryptedChapter = encrypt({
      bookNumber: randomChapter.bookNumber,
      chapterNumber: randomChapter.chapterNumber,
    });

    setCookie(chapterCookieName, encryptedChapter);

    return censorChapterContent(randomChapter, wordsGuess, false);
  }

  // Se há capítulo armazenado, decodificá-lo
  const decryptedChapter: CurrentRandomChapter = decrypt(storedChapterCookie.value, "json");

  // Buscar detalhes do capítulo a partir dos números decodificados
  const chapterData = await getChapter({ bookNumber: decryptedChapter.bookNumber, chapterNumber: decryptedChapter.chapterNumber });

  // Censurar conteúdo do capítulo baseado nas palavras adivinhadas (se houver)
  const { bookName, chapterNumber, verses, countWordsGuess, win } = censorChapterContent(chapterData, wordsGuess, giveUp);

  return {
    bookName,
    chapterNumber,
    verses,
    countWordsGuess,
    win,
  };
}
