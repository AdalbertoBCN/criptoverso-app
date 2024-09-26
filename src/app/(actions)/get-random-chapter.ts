"use server"
import { decrypt, encrypt } from "@/lib/crypto";
import { 
  getchapterCookieName, 
  getwordsGuessCookieName 
} from "@/lib/utils";
import { censorChapterContent } from "@/lib/censor-chapter";
import type { CensorChapter, CurrentRandomChapter, GetRandomChapterResponse } from "@/types";
import { cookies as storedCookies } from "next/headers";
import { env } from "@/env";

// Função para obter e armazenar cookies
const getCookie = (cookieName: string) => {
  const cookies = storedCookies();
  return cookies.get(cookieName);
};

const setCookie = (cookieName: string, value: string | object, maxAgeInSeconds: number = 60 * 60 * 24 * 7) => {
  const cookies = storedCookies();
  cookies.set(cookieName, typeof value === 'string' ? value : JSON.stringify(value), { maxAge: maxAgeInSeconds, sameSite: "strict"});
};

// Função para buscar capítulo aleatório
const fetchRandomChapterFromAPI = async (isGospel: boolean): Promise<GetRandomChapterResponse> => {
  const url = `${env.API_BASE_URL}/random-chapter${isGospel ? "?isGospel=true" : ""}`;
  const response = await fetch(url);
  return await response.json();
};

// Função para buscar um capítulo específico pelo número
const fetchChapterByNumbers = async (bookNumber: number, chapterNumber: number): Promise<GetRandomChapterResponse> => {
  const url = `${env.API_BASE_URL}/chapters/${bookNumber}/${chapterNumber}`;
  const response = await fetch(url);
  return await response.json();
};

// Função principal com princípios de SOLID e semântica melhorada
export async function fetchRandomChapter(isGospel: boolean): Promise<CensorChapter & { win?: boolean }> {
  const chapterCookieName = getchapterCookieName(isGospel);
  const wordsGuessCookieName = getwordsGuessCookieName(isGospel);

  // Obtenção de cookies
  const storedChapterCookie = getCookie(chapterCookieName);
  const wordsGuessCookie = getCookie(wordsGuessCookieName)?.value;

  // Se não há capítulo armazenado nos cookies, buscar da API
  if (!storedChapterCookie) {
    const randomChapter = await fetchRandomChapterFromAPI(isGospel);

    // Criptografar e armazenar o capítulo nos cookies
    const encryptedChapter = encrypt({
      bookNumber: randomChapter.bookNumber,
      chapterNumber: randomChapter.chapterNumber,
    });

    setCookie(chapterCookieName, encryptedChapter);

    return censorChapterContent(randomChapter);
  }

  // Se há capítulo armazenado, decodificá-lo
  const decryptedChapter: CurrentRandomChapter = decrypt(storedChapterCookie.value, "json");

  // Buscar detalhes do capítulo a partir dos números decodificados
  const chapterData = await fetchChapterByNumbers(decryptedChapter.bookNumber, decryptedChapter.chapterNumber);

  // Censurar conteúdo do capítulo baseado nas palavras adivinhadas (se houver)
  const { bookName, chapterNumber, verses, countWordsGuess, win } = censorChapterContent(chapterData, wordsGuessCookie);

  // Armazenar as palavras adivinhadas no cookie
  setCookie(wordsGuessCookieName, countWordsGuess);

  return {
    bookName,
    chapterNumber,
    verses,
    win,
  };
}
