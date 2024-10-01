-- CreateTable
CREATE TABLE "Book" (
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "testament" TEXT NOT NULL,
    "isGospel" BOOLEAN NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "number" INTEGER NOT NULL,
    "bookNumber" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("number","bookNumber")
);

-- CreateTable
CREATE TABLE "Verse" (
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookNumber" INTEGER NOT NULL,

    CONSTRAINT "Verse_pkey" PRIMARY KEY ("number","chapterNumber","bookNumber")
);

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookNumber_fkey" FOREIGN KEY ("bookNumber") REFERENCES "Book"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verse" ADD CONSTRAINT "Verse_chapterNumber_bookNumber_fkey" FOREIGN KEY ("chapterNumber", "bookNumber") REFERENCES "Chapter"("number", "bookNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
