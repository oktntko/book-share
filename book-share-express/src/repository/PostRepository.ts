import type { Post, Prisma } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { BookRepository } from './BookRepository';
import { books_v1 } from '@googleapis/books';

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
    computedList.push(await mergeVolume(post));
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
  where: Prisma.PostWhereUniqueInput,
) {
  log.trace(reqid, 'findUniquePost');

  return prisma.post
    .findUnique({
      where,
    })
    .then(mergeVolume);
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

// Volume (GoogleAPI) の情報とマージする
// Conditional Types がうまく使えなかったため、 オーバーロード関数 (overload function) を使った。
// 引数が Post | null のときは Nullable 、 引数が Post のときは NonNullable にしたかった。
async function mergeVolume(
  post: Post,
): Promise<Post & { volume: books_v1.Schema$Volume | undefined }>;
async function mergeVolume(
  post: Post | null,
): Promise<(Post & { volume: books_v1.Schema$Volume | undefined }) | null>;
async function mergeVolume(post: Post | null) {
  if (post === null) {
    return null;
  }

  const volume = post.volume_id
    ? await BookRepository.getVolume(post.volume_id).catch(() => undefined)
    : undefined;

  return {
    ...post,
    volume,
  };
}
