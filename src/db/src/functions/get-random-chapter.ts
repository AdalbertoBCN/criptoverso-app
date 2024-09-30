import { z } from "zod";
import { db } from "@db/src/index";
import { books, chapters, verses } from "@db/src/schema";
import { and, eq, sql } from "drizzle-orm";

export const getRandomChapterSchema = z.object({
    isGospel: z.boolean(),
});

export async function getRandomChapter(
  data: z.infer<typeof getRandomChapterSchema>
) {
  const { isGospel } = getRandomChapterSchema.parse(data);

  const queryRandomBookAndChapter = db
  .select({
    bookName: books.name,
    bookNumber: books.number,
    chapterNumber: chapters.number,
  })
  .from(books)
  .innerJoin(chapters, eq(books.number, chapters.bookNumber));

if (isGospel) {
  queryRandomBookAndChapter.where(sql`${books.isGospel} = 1`)
}

const randomBookAndChapter = await queryRandomBookAndChapter
  .orderBy(sql`RANDOM()`)
  .limit(1)
  .get();


  const versesOfRandomBookAndChapter = await db
    .select({
      verseNumber: verses.number,
      text: verses.text,
    })
    .from(verses)
    .where(
      and(
        // randomBookAndChapter is not undefined
        eq(verses.bookNumber, randomBookAndChapter?.bookNumber as number),
        eq(verses.chapterNumber, randomBookAndChapter?.chapterNumber as number)
      )
    )
    .all();

    return {
        bookName: randomBookAndChapter?.bookName as string,
        bookNumber: randomBookAndChapter?.bookNumber as number,
        chapterNumber: randomBookAndChapter?.chapterNumber as number,
        verses: versesOfRandomBookAndChapter,
    }
}
