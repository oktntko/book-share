import log from "~/libs/log";
import { BookQuery, BooksRepository } from "~/repositories/BooksRepository";

// # GET /books
async function listBooks(query: BookQuery) {
  log.debug("listBooks", query);

  return BooksRepository.listBook(query);
}

// # GET /books/:books
async function findUniqueBook(book_id: string) {
  log.debug("findUniqueBook", book_id);

  return BooksRepository.getBook(book_id);
}

export const BooksService = {
  listBooks,
  findUniqueBook,
};
