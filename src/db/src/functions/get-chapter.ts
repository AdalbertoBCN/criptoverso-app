import { z } from "zod";
import { prisma } from "@db/prisma";

// Definição do schema de validação usando Zod
export const getChapterSchema = z.object({
  bookNumber: z.coerce.number(),
  chapterNumber: z.coerce.number(),
});

export async function getChapter(data: z.infer<typeof getChapterSchema>) {
  const { bookNumber, chapterNumber } = getChapterSchema.parse(data);

  const bookChapterAndVerses = await prisma.chapter.findFirst({
    where: {
      number: chapterNumber,
      bookNumber: bookNumber,
    },
    include: {
      book: {
        select:{
          name: true,
        }
      },
      verses: {
        select: {
          number: true,
          text: true,
        },
      }
    },
  });

  if (!bookChapterAndVerses) {
    throw new Error("Capítulo não encontrado");
  }

  return {
    bookName: bookChapterAndVerses.book.name,
    bookNumber,
    chapterNumber,
    verses: bookChapterAndVerses.verses,
  };
}
