import { relations } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core";

export const books = sqliteTable('books', {
    number: integer("number").notNull().primaryKey(),
    name: text("name").notNull(),
    testament: text("testament", { enum: ["old", "new"] }).notNull(),
    isGospel: integer("isGospel", { mode: "boolean" }).notNull(),
});

export const booksRelations = relations(books, ({ many }) => ({
    chapters:  many(chapters),
  }));

  export const chapters = sqliteTable('chapters', {
    number: integer("number").notNull(),
    bookNumber: integer("book_number").notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.number, table.bookNumber] }),
    };
});

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
    author: one(books, {
      fields: [chapters.bookNumber],
      references: [books.number],
    }),
    verses: many(verses),
  }));

  export const verses = sqliteTable('verses', {
    number: integer("number").notNull(),
    text: text("text").notNull(),
    chapterNumber: integer("chapter_number").notNull(),
    bookNumber: integer("book_number").notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.number, table.chapterNumber, table.bookNumber] }),
    };
});

export const versesRelations = relations(verses, ({ one }) => ({
    chapter: one(chapters, {
      fields: [verses.chapterNumber],
      references: [chapters.number],
    }),
}));