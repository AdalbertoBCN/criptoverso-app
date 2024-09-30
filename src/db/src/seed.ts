import { books, chapters, verses } from "./schema";
import bibliaJson from "../bible.json";
import { db } from '@db/src/index';

const bible: Biblia = bibliaJson as Biblia;

async function seed() {
    db.transaction((tx) => {
        // Deletar dados existentes
        tx.delete(verses).run();
        tx.delete(chapters).run();
        tx.delete(books).run();

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
        tx.insert(books).values(booksToInsert).run();

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

        // Inserir capítulos e versículos em lotes
        const chunkSize = 1000; // Ajuste conforme necessário
        for (let i = 0; i < chaptersToInsert.length; i += chunkSize) {
            const chunk = chaptersToInsert.slice(i, i + chunkSize);
            tx.insert(chapters).values(chunk).run();
        }

        for (let i = 0; i < versesToInsert.length; i += chunkSize) {
            const chunk = versesToInsert.slice(i, i + chunkSize);
            tx.insert(verses).values(chunk).run();
        }
    });

    console.log("Seed completed successfully");
}

seed().finally(() => process.exit(1));

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