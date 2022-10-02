import axios from "~/libs/axios";
import { PrismaClient } from "~/type";

async function getBook(google_id: string) {
  const book = await axios.get(`https://www.googleapis.com/books/v1/volumes/${google_id}`);

  // TODO
  return {
    google_id,
    book_title: book.data.volumeInfo.title as string,
  };
}

async function createBook(
  prisma: PrismaClient,
  book: {
    google_id: string;
    book_title: string;
  }
) {
  return prisma.book.create({
    select: {
      book_id: true,
      google_id: true,
      book_title: true,
    },
    data: {
      google_id: book.google_id,
      book_title: book.book_title,
    },
  });
}

async function findUniqueBook(prisma: PrismaClient, google_id: string) {
  return prisma.book.findUnique({
    select: {
      book_id: true,
      google_id: true,
      book_title: true,
    },
    where: {
      google_id,
    },
  });
}

export const BooksRepository = {
  getBook,
  findUniqueBook,
  createBook,
};
