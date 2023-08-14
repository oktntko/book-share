import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/lib/prisma';
import { PostRepository } from '~/repository/PostRepository';
import { PREVIOUS_IS_NOT_FOUND_MESSAGE, checkPreviousVersion } from '~/repository/_';
import type { PostRouterSchema } from '~/schema/PostRouterSchema';

// # post.list
async function listPost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof PostRouterSchema.listInput>,
) {
  log.trace(reqid, 'listPost', operator_id, input);

  const where: Prisma.PostWhereInput = {};
  if (input.where) {
    where.OR = [
      { book_title: { contains: input.where.keyword } },
      { post_title: { contains: input.where.keyword } },
      { content: { contains: input.where.keyword } },
    ];
  }

  log.debug('where', where);

  const orderBy: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> = input.sort.map(
    ({ field, order }) => {
      if (field.includes('.')) {
        const [table, column] = field.split('.');
        return { [table]: { [column]: order } };
      } else {
        return { [field]: order };
      }
    },
  );

  const [total, post_list] = await Promise.all([
    PostRepository.countPost(reqid, prisma, where),
    PostRepository.findManyPost(reqid, prisma, where, orderBy, input.limit, input.offset),
  ]);

  return {
    total,
    post_list,
  };
}

// # post.create
async function createPost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof PostRouterSchema.createInput>,
) {
  log.trace(reqid, 'createPost', operator_id, input);

  return PostRepository.createPost(reqid, prisma, operator_id, input);
}

// # post.get
async function getPost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof PostRouterSchema.getInput>,
) {
  log.trace(reqid, 'getPost', operator_id, input);

  const post = await PostRepository.findUniquePost(reqid, prisma, input);

  if (!post) {
    throw new TRPCError({ code: 'NOT_FOUND', message: PREVIOUS_IS_NOT_FOUND_MESSAGE });
  }

  return post;
}

// # post.update
async function updatePost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof PostRouterSchema.updateInput>,
) {
  log.trace(reqid, 'updatePost', operator_id, input);

  await checkPreviousVersion({
    previous: PostRepository.findUniquePost(reqid, prisma, { post_id: input.post_id }),
    updated_at: input.updated_at,
  });

  return PostRepository.updatePost(reqid, prisma, operator_id, input, input.post_id);
}

// # post.delete
async function deletePost(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof PostRouterSchema.deleteInput>,
) {
  log.trace(reqid, 'deletePost', operator_id, input);

  await checkPreviousVersion({
    previous: PostRepository.findUniquePost(reqid, prisma, { post_id: input.post_id }),
    updated_at: input.updated_at,
  });

  return PostRepository.deletePost(reqid, prisma, input.post_id);
}

export const PostService = {
  listPost,
  createPost,
  getPost,
  updatePost,
  deletePost,
};
