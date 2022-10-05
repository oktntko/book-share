import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import { BooksService } from "~/services/BooksService";

export const books = createAuthorizedRouter()
  // # GET /books
  .query("list", {
    input: z.object({
      q: z.string().trim().max(400).min(1),
      queryfield: z
        .enum(["", "intitle", "inauthor", "inpublisher", "subject", "isbn", "lccn", "oclc"])
        .optional(),
      startIndex: z.number().int().optional(),
      maxResults: z.number().int().positive().max(40).optional(),
      orderBy: z.enum(["newest", "relevance"]).optional(),
      printType: z.enum(["all", "books", "magazines"]).optional(),
      projection: z.enum(["full", "lite"]).optional(),
    }),
    resolve: async ({ input }) => {
      return BooksService.listBooks(input);
    },
  })
  // # GET /books/:book_id
  .query("get", {
    input: z.object({
      book_id: z.string().trim().max(255).min(1),
    }),
    resolve: async ({ input }) => {
      return BooksService.findUniqueBook(input.book_id);
    },
  });
