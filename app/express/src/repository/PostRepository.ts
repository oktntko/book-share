import type { Prisma } from '@book-share/prisma/client';
import { log } from '~/lib/log4js';
import { ProtectedContext, PublicContext } from '~/middleware/trpc';
import { mergeVolume } from '~/repository/BookRepository';

export const PostRepository = {
  countPost,
  findManyPost,
  findUniquePost,
  createPost,
  updatePost,
  deletePost,
  countPostGroupByVolumeId,
};

async function countPost(
  ctx: PublicContext,
  params: {
    where: Prisma.PostWhereInput;
  },
) {
  log.trace(ctx.reqid, 'countPost');

  return ctx.prisma.post.count({
    where: params.where,
  });
}

async function findManyPost(
  ctx: PublicContext,
  params: {
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    take?: number;
    skip?: number;
  },
) {
  log.trace(ctx.reqid, 'findManyPost');

  const post_list = await ctx.prisma.post.findMany({
    include: {
      toukousya: true,
      _count: {
        select: {
          hearted_list: true,
        },
      },
    },
    where: params.where,
    orderBy: params.orderBy,
    take: params.take,
    skip: params.skip,
  });

  // Array.prototype.map() を使うと overload function の効果が消えて戻り値が Nullable になるため、
  // for of を使っている。
  const computedList = [];
  for (const post of post_list) {
    computedList.push(await mergeVolume(ctx, post));
  }

  return computedList;
}

async function findUniquePost(
  ctx: PublicContext,
  params: {
    where: Prisma.PostWhereUniqueInput;
  },
) {
  log.trace(ctx.reqid, 'findUniquePost');

  return ctx.prisma.post
    .findUnique({
      include: {
        toukousya: true,
        _count: {
          select: {
            hearted_list: true,
          },
        },
      },
      where: params.where,
    })
    .then((post) => mergeVolume(ctx, post));
}

async function createPost(
  ctx: ProtectedContext,
  params: {
    data: Omit<Prisma.PostUncheckedCreateInput, 'post_id' | 'toukousya_id' | CommonColumn>;
  },
) {
  log.trace(ctx.reqid, 'createPost');

  return ctx.prisma.post.create({
    include: {},
    data: {
      toukousya_id: ctx.operator.user_id,
      volume_id: params.data.volume_id,
      book_title: params.data.book_title,
      post_title: params.data.post_title,
      content: params.data.content,
      published: params.data.published,
      published_at: params.data.published_at,
    },
  });
}

async function updatePost(
  ctx: ProtectedContext,
  params: {
    where: Prisma.PostWhereUniqueInput;
    data: Omit<Prisma.PostUncheckedUpdateInput, 'post_id' | 'toukousya_id' | CommonColumn>;
  },
) {
  log.trace(ctx.reqid, 'updatePost');

  return ctx.prisma.post.update({
    data: {
      toukousya_id: ctx.operator.user_id,
      volume_id: params.data.volume_id,
      book_title: params.data.book_title,
      post_title: params.data.post_title,
      content: params.data.content,
      published: params.data.published,
      published_at: params.data.published_at,
    },
    where: params.where,
  });
}

async function deletePost(
  ctx: ProtectedContext,
  params: {
    where: Prisma.PostWhereUniqueInput;
  },
) {
  log.trace(ctx.reqid, 'deletePost');

  return ctx.prisma.post.delete({
    where: params.where,
  });
}

async function countPostGroupByVolumeId(
  ctx: PublicContext,
  params: {
    where: Prisma.PostWhereInput;
  },
) {
  log.debug(ctx.reqid, 'countPostGroupByVolumeId');

  return ctx.prisma.post.groupBy({
    by: ['volume_id'],
    _count: true,
    where: params.where,
    orderBy: [{ _count: { volume_id: 'desc' } }, { volume_id: 'asc' }],
    take: 10,
  });
}
