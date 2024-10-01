import { PrismaClient } from '@prisma/client';
import bibliaJson from "./bible.json";

const prisma = new PrismaClient();
const bible: Biblia = bibliaJson as Biblia;

async function seed() {
  try {
    // Deletar dados existentes
    await prisma.verse.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.book.deleteMany();

    // Inserir livros
    const booksToInsert: BookInsert[] = [
      ...bible.antigoTestamento.map((book, index) => ({
        number: index + 1,
        name: book.nome,
        testament: "old" as const,
        isGospel: false
      })),
      ...bible.novoTestamento.map((book, index) => ({
        number: index + 47,
        name: book.nome,
        testament: "new" as const,
        isGospel: [47, 48, 49, 50].includes(index + 47),
      }))
    ];

    await prisma.book.createMany({
      data: booksToInsert,
    });

    // Inserir capítulos e versículos
    const chaptersToInsert: ChapterInsert[] = [];
    const versesToInsert: VerseInsert[] = [];

    [...bible.antigoTestamento, ...bible.novoTestamento].forEach((book, bookIndex) => {
      book.capitulos.forEach((chapter, chapterIndex) => {
        const chapterNumber = chapterIndex + 1;

        chaptersToInsert.push({
          number: chapterNumber,
          bookNumber: bookIndex + 1
        });

        chapter.versiculos.forEach(verse => {
          versesToInsert.push({
            number: verse.versiculo,
            text: verse.texto,
            chapterNumber: chapterNumber,
            bookNumber: bookIndex + 1
          });
        });
      });
    });

    // Inserir capítulos em lotes
    const chunkSize = 1000; // Ajuste conforme necessário para seu caso
    for (let i = 0; i < chaptersToInsert.length; i += chunkSize) {
      const chunk = chaptersToInsert.slice(i, i + chunkSize);
      await prisma.chapter.createMany({
        data: chunk,
      });
    }

    // Inserir versículos em lotes
    for (let i = 0; i < versesToInsert.length; i += chunkSize) {
      const chunk = versesToInsert.slice(i, i + chunkSize);
      await prisma.verse.createMany({
        data: chunk,
      });
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed().finally(() => process.exit(1));

// Interfaces para tipagem dos dados da Bíblia
interface Biblia {
  antigoTestamento: Livro[];
  novoTestamento: Livro[];
}

interface Livro {
  nome: string;
  capitulos: Capitulo[];
}

interface Capitulo {
  capitulo: number;
  versiculos: Versiculo[];
}

export interface Versiculo {
  versiculo: number;
  texto: string;
}

interface BookInsert {
  number: number;
  name: string;
  testament: "old" | "new";
  isGospel: boolean;
}

interface ChapterInsert {
  number: number;
  bookNumber: number;
}

interface VerseInsert {
  number: number;
  text: string;
  chapterNumber: number;
  bookNumber: number;
}
