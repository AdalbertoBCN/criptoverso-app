import { z } from "zod";
import { db } from "@db/src/index";
import { books, chapters, verses } from "@db/src/schema";
import { and, eq } from "drizzle-orm";

export const getChapterSchema = z.object({
    bookNumber: z.number(),
    chapterNumber: z.number(),  
});

export async function getChapter(
  data: z.infer<typeof getChapterSchema>
) {
  const { bookNumber, chapterNumber } = getChapterSchema.parse(data);

  const bookAndChapter = db
  .select({
    bookName: books.name,
    bookNumber: books.number,
    chapterNumber: chapters.number,
  })
  .from(books)
  .where(
    and(
        eq(books.number, bookNumber),
        eq(chapters.number, chapterNumber)
  ))
  .innerJoin(chapters, eq(books.number, chapters.bookNumber))
  .get();

  const versesOfRandomBookAndChapter = await db
    .select({
      verseNumber: verses.number,
      text: verses.text,
    })
    .from(verses)
    .where(
      and(
        eq(verses.bookNumber, bookAndChapter?.bookNumber as number),
        eq(verses.chapterNumber, bookAndChapter?.chapterNumber as number)
      )
    )
    .all();

    return {
        bookName: bookAndChapter?.bookName as string,
        bookNumber: bookAndChapter?.bookNumber as number,
        chapterNumber: bookAndChapter?.chapterNumber as number,
        verses: versesOfRandomBookAndChapter,
    }
}
