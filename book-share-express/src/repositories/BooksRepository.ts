import axios from "~/libs/axios";

async function getBook(google_id: string) {
  return axios.get(`https://www.googleapis.com/books/v1/volumes/${google_id}`);
}

export const BooksRepository = {
  getBook,
};
