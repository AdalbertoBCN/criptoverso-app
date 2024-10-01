import { z } from "zod";
import { prisma } from "@db/prisma";

export const getRandomChapterSchema = z.object({
  isGospel: z.boolean(),
});

export async function getRandomChapter(
  data: z.infer<typeof getRandomChapterSchema>
) {
  // Valida o input
  const { isGospel } = getRandomChapterSchema.parse(data);

  const randomBookChapter = await prisma.chapter.findFirst({
    where: isGospel ? { book: { isGospel: true } } : {},
    orderBy: {
      number: 'asc'
    },
    skip: Math.floor(Math.random() * await prisma.chapter.count({
      where: isGospel ? { book: { isGospel: true } } : {},
    })),
    include: {
      book: {
        select: {
          name: true,
        },
      },
      verses: {
        select: {
          number: true,
          text: true,
        },
      },
    },
  });

  if (!randomBookChapter) {
    return { error: 'Nenhum capítulo encontrado.' };
  }

  // Formatando o resultado para retornar os dados
  const formattedResult = {
    bookName: randomBookChapter.book.name,
    bookNumber: randomBookChapter.bookNumber,
    chapterNumber: randomBookChapter.number,
    verses: randomBookChapter.verses.map((verse) => ({
      number: verse.number,
      text: verse.text,
    })),
  };

  return formattedResult;
}