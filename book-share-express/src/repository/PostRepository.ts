import type { Post, Prisma } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/lib/prisma';

type ParamPost = Omit<Post, 'post_id' | 'toukousya_id' | CommonColumn>;

async function countPost(reqid: string, prisma: PrismaClient, where: Prisma.PostWhereInput) {
  log.trace(reqid, 'countPost');

  return prisma.post.count({
    where,
  });
}

async function findManyPost(
  reqid: string,
  prisma: PrismaClient,
  where?: Prisma.PostWhereInput,
  orderBy?: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput>,
  take?: number,
  skip?: number,
) {
  log.trace(reqid, 'findManyPost');

  return prisma.post.findMany({
    where,
    orderBy,
    take,
    skip,
  });
}

async function createPost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  post: ParamPost,
) {
  log.trace(reqid, 'createPost');

  return prisma.post.create({
    include: {},
    data: {
      toukousya_id: operator_id,
      book_id: post.book_id,
      book_title: post.book_title,
      content: post.content,
      hearts: post.hearts,
      post_title: post.post_title,
      published: post.published,
      published_at: post.published_at,
    },
  });
}

async function findUniquePost(
  reqid: string,
  prisma: PrismaClient,
  where: RequireOne<Prisma.PostWhereUniqueInput>,
) {
  log.trace(reqid, 'findUniquePost');

  return prisma.post.findUnique({
    where: { post_id: where.post_id },
  });
}

async function updatePost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  post: ParamPost,
  post_id: number,
) {
  log.trace(reqid, 'updatePost');

  return prisma.post.update({
    data: {
      toukousya_id: operator_id,
      book_id: post.book_id,
      book_title: post.book_title,
      content: post.content,
      hearts: post.hearts,
      post_title: post.post_title,
      published: post.published,
      published_at: post.published_at,
    },
    where: { post_id },
  });
}

async function deletePost(reqid: string, prisma: PrismaClient, post_id: number) {
  log.trace(reqid, 'deletePost');

  return prisma.post.delete({
    where: { post_id },
  });
}

export const PostRepository = {
  countPost,
  findManyPost,
  createPost,
  findUniquePost,
  updatePost,
  deletePost,
};
