import type { Post, Prisma } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { mergeVolume } from '~/repository/BookRepository';

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
  orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  log.trace(reqid, 'findManyPost');

  const post_list = await prisma.post.findMany({
    where,
    orderBy,
    take,
    skip,
  });

  // Array.prototype.map() を使うと overload function の効果が消えて戻り値が Nullable になるため、
  // for of を使っている。
  const computedList = [];
  for (const post of post_list) {
    computedList.push(await mergeVolume(reqid, post));
  }

  return computedList;
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
      volume_id: post.volume_id,
      book_title: post.book_title,
      post_title: post.post_title,
      content: post.content,
      hearts: post.hearts,
      published: post.published,
      published_at: post.published_at,
    },
  });
}

async function findUniquePost(
  reqid: string,
  prisma: PrismaClient,
  where: Prisma.PostWhereUniqueInput,
) {
  log.trace(reqid, 'findUniquePost');

  return prisma.post
    .findUnique({
      where,
    })
    .then((post) => mergeVolume(reqid, post));
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
      volume_id: post.volume_id,
      book_title: post.book_title,
      post_title: post.post_title,
      content: post.content,
      hearts: post.hearts,
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

async function countPostGroupByVolumeId(
  reqid: string,
  prisma: PrismaClient,
  where: Prisma.PostWhereInput,
) {
  log.debug(reqid, 'countPostGroupByVolumeId');

  return prisma.post.groupBy({
    by: ['volume_id'],
    _count: true,
    where,
    orderBy: [{ _count: { volume_id: 'desc' } }, { volume_id: 'asc' }],
    take: 10,
  });
}

export const PostRepository = {
  countPost,
  findManyPost,
  createPost,
  findUniquePost,
  updatePost,
  deletePost,
  countPostGroupByVolumeId,
};
