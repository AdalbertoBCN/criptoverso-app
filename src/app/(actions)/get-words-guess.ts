"use server"
import { getwordsGuessCookieName } from "@/lib/utils";
import { cookies as storedCookies } from "next/headers"

export async function getWordsGuess(isGospel: boolean) {
    const cookies = storedCookies();

    const wordsGuessCookieName = getwordsGuessCookieName(isGospel);

    const wordsGuess = cookies.get(wordsGuessCookieName)?.value

    return wordsGuess ? JSON.parse(wordsGuess) : { words: [] };
}
