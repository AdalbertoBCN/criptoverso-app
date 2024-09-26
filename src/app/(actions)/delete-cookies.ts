"use server"

import { getchapterCookieName, getwordsGuessCookieName } from "@/lib/utils";
import { cookies as storedCookies } from "next/headers"

export async function deleteCookies(isGospel: boolean) {
    const cookies = storedCookies();

    const chapterCookieName = getchapterCookieName(isGospel);
    const wordsGuessCookieName = getwordsGuessCookieName(isGospel);

    cookies.delete(chapterCookieName);
    cookies.delete(wordsGuessCookieName);
}