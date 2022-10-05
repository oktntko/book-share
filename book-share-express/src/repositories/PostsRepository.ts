import { Prisma } from "@prisma/client";
import log from "~/libs/log";
import { PrismaClient } from "~/type";

async function countPosts(prisma: PrismaClient, where: Prisma.PostWhereInput) {
  log.debug("countPosts");

  return prisma.post.count({
    where,
  });
}

async function findManyPosts(
  prisma: PrismaClient,
  where: Prisma.PostWhereInput,
  orderBy: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> = {
    created_at: "desc",
  },
  take?: number,
  skip?: number
) {
  log.debug("findManyPosts");

  return prisma.post.findMany({
    select: {
      post_id: true,
      book_id: true,
      book_title: true,
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      content: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    where,
    orderBy,
    take,
    skip,
  });
}

async function createPost(
  prisma: PrismaClient,
  operator_id: number,
  post: {
    book_id: string;
    book_title: string;
    post_title: string;
    content: string;
  }
) {
  log.debug("createPost", operator_id);

  return prisma.post.create({
    select: {
      post_id: true,
      book_id: true,
      book_title: true,
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      content: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      book_id: post.book_id,
      book_title: post.book_title,
      contributor_id: operator_id,
      post_title: post.post_title,
      content: post.content,
      created_by: operator_id,
      updated_by: operator_id,
    },
  });
}

async function findUniquePost(prisma: PrismaClient, post_id: number) {
  log.debug("findUniquePost");

  return prisma.post.findUnique({
    select: {
      post_id: true,
      book_id: true,
      book_title: true,
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      content: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    where: {
      post_id,
    },
  });
}

async function updatePost(
  prisma: PrismaClient,
  operator_id: number,
  post_id: number,
  post: {
    book_id: string;
    book_title: string;
    post_title: string;
    content: string;
  }
) {
  log.debug("updatePost", operator_id);

  return prisma.post.update({
    select: {
      post_id: true,
      book_id: true,
      book_title: true,
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      content: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      book_id: post.book_id,
      book_title: post.book_title,
      contributor_id: operator_id,
      post_title: post.post_title,
      content: post.content,
      updated_by: operator_id,
    },
    where: {
      post_id,
    },
  });
}

async function deletePost(prisma: PrismaClient, operator_id: number, post_id: number) {
  log.debug("deletePost", operator_id);

  return prisma.post.delete({
    select: {
      post_id: true,
      book_id: true,
      book_title: true,
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      content: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    where: {
      post_id,
    },
  });
}

async function publishPost(
  prisma: PrismaClient,
  operator_id: number,
  post_id: number,
  post: { publish: boolean }
) {
  return prisma.post.update({
    select: {
      post_id: true,
      book_id: true,
      book_title: true,
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      content: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      published: post.publish,
      updated_by: operator_id,
    },
    where: {
      post_id,
    },
  });
}

export const PostsRepository = {
  countPosts,
  findManyPosts,
  createPost,
  findUniquePost,
  updatePost,
  deletePost,
  //
  publishPost,
};
