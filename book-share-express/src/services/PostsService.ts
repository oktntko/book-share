import { Prisma } from "@prisma/client";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { BooksRepository } from "~/repositories/BooksRepository";
import { PostsRepository } from "~/repositories/PostsRepository";
import { PrismaClient } from "~/type";

// # GET /posts
async function listPosts(input: {
  google_id: string;
  keyword: string;
  contributor_id?: number | undefined;
  sort: ("hearts" | "created_at" | "book_title" | "post_title")[];
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
        description: {
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
    description: string;
    google_id: string;
  }
) {
  const book = await BooksRepository.getBook(input.google_id);
  const book_title: string = book.data.volumeInfo.title;

  return PostsRepository.createPost(prisma, operator_id, {
    post_title: input.post_title,
    description: input.description,
    google_id: input.google_id,
    book_title,
  });
}

// # GET /posts/:post_id
async function findUniquePost(post_id: number) {
  return PostsRepository.findUniquePost(ORM, post_id);
}

// # PUT /posts/:post_id
async function updatePost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    post_id: number;
    post_title: string;
    description: string;
    google_id: string;
  }
) {
  const book = await BooksRepository.getBook(input.google_id);
  const book_title: string = book.data.volumeInfo.title;

  return PostsRepository.updatePost(prisma, operator_id, input.post_id, {
    post_title: input.post_title,
    description: input.description,
    google_id: input.google_id,
    book_title,
  });
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

export const PostsService = {
  listPosts,
  createPost,
  findUniquePost,
  updatePost,
  publishPost,
  deletePost,
};
