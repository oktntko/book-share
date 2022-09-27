import { Prisma } from "@prisma/client";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc } from "~/libs/trpc";
import { BooksRepository } from "~/repositories/BooksRepository";
import { PostsRepository } from "~/repositories/PostsRepository";
import { PrismaClient } from "~/type";

// # GET /posts
async function listPosts(input: {
  google_id?: string;
  keyword?: string;
  contributor_id?: number | undefined;
  sort: ("hearts" | "created_at" | "updated_at" | "book_title" | "post_title")[];
  limit: number;
  offset: number;
}) {
  log.debug("listPosts", input);

  const where: Prisma.PostWhereInput = {};
  if (input.google_id) {
    where.book = {
      google_id: input.google_id,
    };
  }

  if (input.keyword) {
    where.OR = [
      {
        book: {
          book_title: {
            contains: input.keyword,
          },
        },
      },
      {
        post_title: {
          contains: input.keyword,
        },
      },
      {
        content: {
          contains: input.keyword,
        },
      },
    ];
  }

  if (input.contributor_id) {
    where.contributor_id = input.contributor_id;
  }

  log.debug("where", where);

  const orderBy: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> = input.sort.map((key) => {
    switch (key) {
      case "hearts":
        return {
          hearts: "desc",
        };
      case "created_at":
        return {
          created_at: "desc",
        };
      case "updated_at":
        return {
          updated_at: "desc",
        };
      case "book_title":
        return {
          book: {
            book_title: "asc",
          },
        };
      case "post_title":
        return {
          post_title: "asc",
        };
    }
  });

  const total = await PostsRepository.countPosts(ORM, where);
  const posts = await PostsRepository.findManyPosts(ORM, where, orderBy, input.limit, input.offset);

  return {
    total,
    posts,
  };
}

// # POST /posts
async function createPost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    post_title: string;
    content: string;
    google_id?: string;
  }
) {
  const book = input.google_id ? await findBookOrCreate(prisma, input.google_id) : undefined;

  return PostsRepository.createPost(
    prisma,
    operator_id,
    {
      post_title: input.post_title,
      content: input.content,
    },
    book?.book_id
  );
}

// # GET /posts/:post_id
async function findUniquePost(post_id: number) {
  const post = await PostsRepository.findUniquePost(ORM, post_id);
  if (post == null) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Data already Deleted, please refresh.",
    });
  }
  return post;
}

// # PUT /posts/:post_id
async function updatePost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    post_id: number;
    post_title: string;
    content: string;
    google_id?: string;
  }
) {
  const book = input.google_id ? await findBookOrCreate(prisma, input.google_id) : undefined;

  return PostsRepository.updatePost(
    prisma,
    operator_id,
    input.post_id,
    {
      post_title: input.post_title,
      content: input.content,
    },
    book?.book_id
  );
}

// # PATCH /posts/:post_id/publish
// # PATCH /posts/:post_id/unpublish
async function publishPost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    post_id: number;
    publish: boolean;
  }
) {
  return PostsRepository.publishPost(prisma, operator_id, input.post_id, {
    publish: input.publish,
  });
}

// # DELETE /posts/:post_id
async function deletePost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    post_id: number;
  }
) {
  return PostsRepository.deletePost(prisma, operator_id, input.post_id);
}

async function findBookOrCreate(prisma: PrismaClient, google_id: string) {
  const book = await BooksRepository.findUniqueBook(prisma, google_id);
  if (book) {
    return book;
  }

  return BooksRepository.getBook(google_id).then((book) =>
    BooksRepository.createBook(prisma, book)
  );
}

export const PostsService = {
  listPosts,
  createPost,
  findUniquePost,
  updatePost,
  publishPost,
  deletePost,
  findBookOrCreate,
};
