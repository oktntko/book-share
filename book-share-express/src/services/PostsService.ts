import { Prisma } from "@prisma/client";
import dayjs from "~/libs/dayjs";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc } from "~/libs/trpc";
import { BooksRepository } from "~/repositories/BooksRepository";
import { PostsRepository } from "~/repositories/PostsRepository";
import { PrismaClient } from "~/type";

// # GET /posts
async function listPosts(input: {
  book_id?: string;
  keyword?: string;
  contributor_id?: number | undefined;
  sort: ("hearts" | "created_at" | "updated_at" | "book_title" | "post_title")[];
  limit: number;
  offset: number;
  published: "PUBLISHED" | "UNPUBLISHED" | "ALL";
}) {
  log.debug("listPosts", input);

  const where: Prisma.PostWhereInput = {};
  if (input.book_id) {
    where.book_id = input.book_id;
  }

  if (input.keyword) {
    where.OR = [
      {
        book_title: {
          contains: input.keyword,
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

  if (input.published === "PUBLISHED") {
    where.published = true;
  } else if (input.published === "UNPUBLISHED") {
    where.published = false;
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
          book_title: "asc",
        };
      case "post_title":
        return {
          post_title: "asc",
        };
    }
  });

  const [total, posts] = await Promise.all([
    PostsRepository.countPosts(ORM, where),
    PostsRepository.findManyPosts(ORM, where, orderBy, input.limit, input.offset),
  ]);

  return {
    total,
    posts: await Promise.all(
      posts.map(async (post) => {
        const book = post.book_id ? await BooksRepository.getBook(post.book_id) : undefined;
        return {
          ...post,
          book,
        };
      })
    ),
  };
}

// # GET /posts/ranking
async function rankingPosts(input: { span: "WEEK" | "MONTH" | "ALL" }) {
  log.debug("rankingPosts", input);

  const where: Prisma.PostWhereInput = {};

  where.book_id = {
    not: "",
  };

  if (input.span === "WEEK") {
    where.created_at = {
      gte: dayjs().subtract(1, "week").startOf("day").toDate(),
    };
  } else if (input.span === "MONTH") {
    where.created_at = {
      gte: dayjs().subtract(1, "month").startOf("day").toDate(),
    };
  }

  const book_id_list = await PostsRepository.groupByBookId(ORM, where);

  return {
    books: await Promise.all(
      book_id_list.map(async (data) => {
        const book = await BooksRepository.getBook(data.book_id);
        return {
          count: data._count,
          ...book,
        };
      })
    ),
  };
}

// # POST /posts
async function createPost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    book_id: string;
    book_title: string;
    post_title: string;
    content: string;
  }
) {
  const post = await PostsRepository.createPost(prisma, operator_id, {
    book_id: input.book_id,
    book_title: input.book_title,
    post_title: input.post_title,
    content: input.content,
  });

  const book = post.book_id ? await BooksRepository.getBook(post.book_id) : undefined;

  return {
    ...post,
    book,
  };
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

  const book = post.book_id ? await BooksRepository.getBook(post.book_id) : undefined;

  return {
    ...post,
    book,
  };
}

// # PUT /posts/:post_id
async function updatePost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    book_id: string;
    book_title: string;
    post_id: number;
    post_title: string;
    content: string;
  }
) {
  const post = await PostsRepository.updatePost(prisma, operator_id, input.post_id, {
    book_id: input.book_id,
    book_title: input.book_title,
    post_title: input.post_title,
    content: input.content,
  });

  const book = post.book_id ? await BooksRepository.getBook(post.book_id) : undefined;

  return {
    ...post,
    book,
  };
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
  const post = await PostsRepository.publishPost(prisma, operator_id, input.post_id, {
    publish: input.publish,
  });

  const book = post.book_id ? await BooksRepository.getBook(post.book_id) : undefined;

  return {
    ...post,
    book,
  };
}

// # DELETE /posts/:post_id
async function deletePost(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    post_id: number;
  }
) {
  const post = await PostsRepository.deletePost(prisma, operator_id, input.post_id);

  const book = post.book_id ? await BooksRepository.getBook(post.book_id) : undefined;

  return {
    ...post,
    book,
  };
}

export const PostsService = {
  listPosts,
  createPost,
  findUniquePost,
  updatePost,
  publishPost,
  deletePost,
  rankingPosts,
};
