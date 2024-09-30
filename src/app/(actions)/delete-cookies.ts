"use server"

import { getchapterStorageName, } from "@/lib/utils";
import { cookies as storedCookies } from "next/headers"

export async function deleteCookies(isGospel: boolean) {
    const cookies = storedCookies();

    const chapterCookieName = getchapterStorageName(isGospel);

    cookies.delete(chapterCookieName);
}