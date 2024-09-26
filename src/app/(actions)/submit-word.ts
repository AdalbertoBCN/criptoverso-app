"use server";

import { allWords } from "@/lib/allWords";
import { getwordsGuessCookieName, raise } from "@/lib/utils";
import { WordsGuess } from "@/types";
import { cookies as storedCookies } from "next/headers";
import { z } from "zod";

// Função utilitária para obter cookies
const getStoredWordsGuess = (cookieName: string): WordsGuess => {
    const cookies = storedCookies();
    const storedWordsGuess = cookies.get(cookieName);
    return storedWordsGuess ? JSON.parse(storedWordsGuess.value) : { words: [] };
};

// Função utilitária para definir cookies
const setWordsGuessCookie = (cookieName: string, wordsGuess: WordsGuess) => {
    const cookies = storedCookies();
    cookies.set(cookieName, JSON.stringify(wordsGuess), { maxAge: 60 * 60 * 24 * 7 , sameSite: "strict" });
};

// Função de validação com Zod
const createWordSchema = (cookieName: string) => z.object({
    word: z.string()
        .trim()
        .min(1, { message: "" })
        .refine(value => !/[^\w\sÀ-ÿ]/ig.test(value), { message: "Palavra contém caracteres inválidos" })
        .refine(value => !allWords.includes(value.toLowerCase()), { message: "Palavra não permitida" })
        .refine(value => {
            const words = value.toLowerCase().split(/\s+/);
            let wordsGuess: WordsGuess = getStoredWordsGuess(cookieName);

            // Verifica se alguma das palavras já foi tentada
            const success = words.every(word => 
                !wordsGuess.words.some(guess => guess.word === word)
            );

            if (!success) {
                words.forEach(word => {
                    wordsGuess = raise(wordsGuess, word); // Atualiza a contagem da palavra tentada
                });
                setWordsGuessCookie(cookieName, wordsGuess);
            }

            return success;
        }, { message: "Você já tentou essa palavra" })
});

// Função genérica para submeter palavras
async function submitWordGeneric(isGospel: boolean, formData: FormData) {
    const cookieName = getwordsGuessCookieName(isGospel);
    const wordSchema = createWordSchema(cookieName);
    
    const parsedData = wordSchema.safeParse(Object.fromEntries(formData));
    if (!parsedData.success) {
        return {
            error: { message: parsedData.error.flatten().fieldErrors.word }
        };
    }

    const words = parsedData.data.word.toLowerCase().split(/\s+/);
    const wordsGuess = getStoredWordsGuess(cookieName);

    // Adiciona cada nova palavra com count 0
    words.forEach(word => {
        wordsGuess.words.push({
            word,
            count: 0
        });
    });

    setWordsGuessCookie(cookieName, wordsGuess);
}

// Funções específicas reutilizando a função genérica
export async function submitWordGospel(_: unknown, formData: FormData) {
    return await submitWordGeneric(true, formData);
}

export async function submitWord(_: unknown, formData: FormData) {
    return await submitWordGeneric(false, formData);
}
