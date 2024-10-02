"use server";

import { allWords } from "@/lib/allWords";
import { getVariations } from "@/lib/getVariations";
import { raise } from "@/lib/utils";
import { WordsGuess } from "@/types";
import { z } from "zod";

// Função de validação com Zod
const createWordSchema = (wordsGuess: WordsGuess) => z.object({
  word: z.string()
    .trim()
    .min(1, { message: "" })
    .refine(value => !/[^\w\sÀ-ÿ]/ig.test(value), { message: "Palavra contém caracteres inválidos" })
    .refine(value => !allWords.includes(value.toLowerCase()), { message: "Palavra não permitida" })
    .refine(value => {
      const words = value.toLowerCase().split(/\s+/);
      // Verifica se alguma das palavras já foi tentada

      const success = words.every(word => {
        const wordsGuessArrayKeys = wordsGuess.words.map((word) => word.word.toLowerCase());

        // Pré-calcula as variações de todas as palavras adivinhadas
        const variationsPossibleWithGuess = Object.fromEntries(
          wordsGuessArrayKeys.map(wordGuess => [wordGuess, getVariations(wordGuess)])
        );

        return !wordsGuess.words.some(guess => {
          const variations = variationsPossibleWithGuess[guess.word.toLowerCase()];
          return guess.word === word || variations.includes(word);
        });
      });

      if (!success) {
        words.forEach(word => {
          wordsGuess = raise(wordsGuess, word); // Atualiza a contagem da palavra tentada
        });
      }

      return success;
    }, { message: "Você já tentou essa palavra" })
});


// Função genérica para submeter palavras
async function submitWordGeneric(
  state: { wordsGuess: WordsGuess },
  formData: FormData
): Promise<{ wordsGuess?: WordsGuess; error?: string }> {
  const { wordsGuess } = state;

  const wordSchema = createWordSchema(wordsGuess);
  const parsedData = wordSchema.safeParse(Object.fromEntries(formData));

  if (!parsedData.success) {
    return {
      wordsGuess: undefined,
      error: parsedData.error.flatten().fieldErrors.word?.[0]
    };
  }

  const words = parsedData.data.word.toLowerCase().split(/\s+/);

  // Adiciona cada nova palavra com count 0
  words.forEach((word) => {
    wordsGuess.words.push({
      word,
      count: 0,
    });
  });

  return {
    error: undefined,
    wordsGuess,
  };
}

// Funções específicas reutilizando a função genérica
export async function submitWordGospel(wordsGuess: WordsGuess, formData: FormData) {
  return await submitWordGeneric({ wordsGuess }, formData);
}

export async function submitWord(wordsGuess: WordsGuess, formData: FormData) {
  return await submitWordGeneric({ wordsGuess }, formData);
}
