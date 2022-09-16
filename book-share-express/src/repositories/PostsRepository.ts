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
      book: {
        select: {
          book_id: true,
          google_id: true,
        },
      },
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      description: true,
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
    post_title: string;
    description: string;
    google_id: string;
    book_title: string;
  }
) {
  log.debug("createPost", operator_id);

  return prisma.post.create({
    select: {
      post_id: true,
      book_id: true,
      book: {
        select: {
          book_id: true,
          google_id: true,
        },
      },
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      description: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      post_title: post.post_title,
      description: post.description,
      contributor: {
        connect: {
          user_id: operator_id,
        },
      },
      book: {
        connectOrCreate: {
          where: {
            google_id: post.google_id,
          },
          create: {
            book_title: post.book_title,
            google_id: post.google_id,
          },
        },
      },
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
      book: {
        select: {
          book_id: true,
          google_id: true,
        },
      },
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      description: true,
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
    post_title: string;
    description: string;
    google_id: string;
    book_title: string;
  }
) {
  log.debug("updatePost", operator_id);

  return prisma.post.update({
    select: {
      post_id: true,
      book_id: true,
      book: {
        select: {
          book_id: true,
          google_id: true,
        },
      },
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      description: true,
      published: true,
      hearts: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      post_title: post.post_title,
      description: post.description,
      contributor: {
        connect: {
          user_id: operator_id,
        },
      },
      book: {
        connectOrCreate: {
          where: {
            google_id: post.google_id,
          },
          create: {
            book_title: post.book_title,
            google_id: post.google_id,
          },
        },
      },
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
      book: {
        select: {
          book_id: true,
          google_id: true,
        },
      },
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      description: true,
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
      book: {
        select: {
          book_id: true,
          google_id: true,
        },
      },
      contributor_id: true,
      contributor: {
        select: {
          user_id: true,
          username: true,
        },
      },
      post_title: true,
      description: true,
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
