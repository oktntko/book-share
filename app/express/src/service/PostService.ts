import type { z } from '@book-share/lib/zod';
import type { Prisma } from '@book-share/prisma/client';
import { log } from '~/lib/log4js';
import { ProtectedContext, PublicContext } from '~/middleware/trpc';
import { PostRepository } from '~/repository/PostRepository';
import { checkDataExist, checkPreviousVersion } from '~/repository/_repository';
import type { PostRouterSchema } from '~/schema/PostRouterSchema';

export const PostService = {
  listPost,
  listMyPost,
  getPost,
  getMyPost,
  createPost,
  updatePost,
  deletePost,
  publishPost,
};

// # post.list
async function listPost(ctx: PublicContext, input: z.infer<typeof PostRouterSchema.listInput>) {
  log.trace(ctx.reqid, 'listPost', input);

  const where: Prisma.PostWhereInput = {};
  if (input.where.keyword) {
    where.OR = [
      { book_title: { contains: input.where.keyword } },
      { post_title: { contains: input.where.keyword } },
      { content: { contains: input.where.keyword } },
    ];
  }

  // 公開中の投稿に対する検索なので、 公開中＝true 固定
  where.published = true;

  log.debug('where', where);

  const orderBy: Prisma.PostOrderByWithRelationInput = { [input.sort.field]: input.sort.order };

  const [total, post_list] = await Promise.all([
    PostRepository.countPost(ctx, { where }),
    PostRepository.findManyPost(ctx, {
      where,
      orderBy,
      take: input.limit,
      skip: input.limit * (input.page - 1),
    }),
  ]);

  return {
    total,
    post_list,
  };
}

// # mypost.list
async function listMyPost(
  ctx: ProtectedContext,
  input: z.infer<typeof PostRouterSchema.listInput>,
) {
  log.trace(ctx.reqid, 'listPost', input);

  const where: Prisma.PostWhereInput = {};
  if (input.where.keyword) {
    where.OR = [
      { book_title: { contains: input.where.keyword } },
      { post_title: { contains: input.where.keyword } },
      { content: { contains: input.where.keyword } },
    ];
  }

  // 自分の投稿に対する検索なので、 投稿者ID＝操作者ID
  where.toukousya_id = ctx.operator.user_id;

  if (input.where.postStatus === '公開中') {
    where.published = true;
  } else if (input.where.postStatus === '下書き') {
    where.published = false;
  }

  log.debug('where', where);

  const orderBy: Prisma.PostOrderByWithRelationInput = { [input.sort.field]: input.sort.order };

  const [total, post_list] = await Promise.all([
    PostRepository.countPost(ctx, { where }),
    PostRepository.findManyPost(ctx, {
      where,
      orderBy,
      take: input.limit,
      skip: input.limit * (input.page - 1),
    }),
  ]);

  return {
    total,
    post_list,
  };
}

// # post.get
async function getPost(ctx: PublicContext, input: z.infer<typeof PostRouterSchema.getInput>) {
  log.trace(ctx.reqid, 'getPost', input);

  const where: Prisma.PostWhereUniqueInput = { post_id: input.post_id };
  // operator_id なしは、公開中の投稿に対する検索なので、 公開中＝true 固定
  where.published = true;

  const post = await checkDataExist({ data: PostRepository.findUniquePost(ctx, { where }) });

  return {
    ...post,
    related_post_list: post.volume_id
      ? await PostRepository.findManyPost(ctx, {
          where: {
            volume_id: post.volume_id,
            post_id: { not: post.post_id },
            published_at: { not: null },
          },
          orderBy: { published_at: 'desc' },
          skip: 0,
          take: 10,
        })
      : [],
  };
}

// # mypost.get
async function getMyPost(ctx: ProtectedContext, input: z.infer<typeof PostRouterSchema.getInput>) {
  log.trace(ctx.reqid, 'getPost', ctx.operator.user_id, input);

  const where: Prisma.PostWhereUniqueInput = { post_id: input.post_id };
  // 自分の投稿に対する検索なので、 投稿者ID＝操作者ID
  where.toukousya_id = ctx.operator.user_id;

  return checkDataExist({ data: PostRepository.findUniquePost(ctx, { where }) });
}

// # mypost.create
async function createPost(
  ctx: ProtectedContext,
  input: z.infer<typeof PostRouterSchema.createInput>,
) {
  log.trace(ctx.reqid, 'createPost', ctx.operator.user_id, input);

  return PostRepository.createPost(ctx, {
    data: { ...input, published: false, published_at: null },
  });
}

// # mypost.update
async function updatePost(
  ctx: ProtectedContext,
  input: z.infer<typeof PostRouterSchema.updateInput>,
) {
  log.trace(ctx.reqid, 'updatePost', ctx.operator.user_id, input);

  const previous = await checkPreviousVersion({
    previous: PostRepository.findUniquePost(ctx, {
      where: { post_id: input.post_id, toukousya_id: ctx.operator.user_id },
    }),
    updated_at: input.updated_at,
  });

  return PostRepository.updatePost(ctx, {
    data: {
      ...input,
      published: previous.published,
      published_at: previous.published_at,
    },
    where: { post_id: input.post_id },
  });
}

// # mypost.delete
async function deletePost(
  ctx: ProtectedContext,
  input: z.infer<typeof PostRouterSchema.deleteInput>,
) {
  log.trace(ctx.reqid, 'deletePost', ctx.operator.user_id, input);

  await checkPreviousVersion({
    previous: PostRepository.findUniquePost(ctx, {
      where: { post_id: input.post_id, toukousya_id: ctx.operator.user_id },
    }),
    updated_at: input.updated_at,
  });

  return PostRepository.deletePost(ctx, { where: { post_id: input.post_id } });
}

// # mypost.publish
async function publishPost(
  ctx: ProtectedContext,
  input: z.infer<typeof PostRouterSchema.publishInput>,
) {
  log.trace(ctx.reqid, 'deletePost', ctx.operator.user_id, input);

  const previous = await checkPreviousVersion({
    previous: PostRepository.findUniquePost(ctx, {
      where: { post_id: input.post_id, toukousya_id: ctx.operator.user_id },
    }),
    updated_at: input.updated_at,
  });

  return PostRepository.updatePost(ctx, {
    data: {
      ...previous,
      published: input.published,
      published_at: input ? new Date() : null,
    },
    where: { post_id: input.post_id },
  });
}
