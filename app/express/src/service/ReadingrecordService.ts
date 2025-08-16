import type { z } from '@book-share/lib/zod';
import type { Prisma } from '@book-share/prisma/client';
import { log } from '~/lib/log4js';
import { ProtectedContext } from '~/middleware/trpc';
import { ReadingrecordRepository } from '~/repository/ReadingrecordRepository';
import { checkDataExist, checkPreviousVersion } from '~/repository/_repository';
import type { ReadingrecordRouterSchema } from '~/schema/ReadingrecordRouterSchema';

export const ReadingrecordService = {
  listReadingrecord,
  getReadingrecord,
  createReadingrecord,
  updateReadingrecord,
  deleteReadingrecord,
};

// # readingrecord.list
async function listReadingrecord(
  ctx: ProtectedContext,
  input: z.infer<typeof ReadingrecordRouterSchema.listInput>,
) {
  log.trace(ctx.reqid, 'listReadingrecord', ctx.operator.user_id, input);

  const where: Prisma.ReadingrecordWhereInput = {};
  where.user_id = ctx.operator.user_id;

  if (input.where.keyword) {
    where.OR = [
      { book_title: { contains: input.where.keyword } },
      { hitokoto: { contains: input.where.keyword } },
    ];
  }

  log.debug('where', where);

  const orderBy: Prisma.ReadingrecordOrderByWithRelationInput = {
    [input.sort.field]: input.sort.order,
  };

  const [total, readingrecord_list] = await Promise.all([
    ReadingrecordRepository.countReadingrecord(ctx, { where }),
    ReadingrecordRepository.findManyReadingrecord(ctx, {
      where,
      orderBy,
      take: input.limit,
      skip: input.limit * (input.page - 1),
    }),
  ]);

  return {
    total,
    readingrecord_list,
  };
}

// # readingrecord.get
async function getReadingrecord(
  ctx: ProtectedContext,
  input: z.infer<typeof ReadingrecordRouterSchema.getInput>,
) {
  log.trace(ctx.reqid, 'getReadingrecord', ctx.operator.user_id, input);

  return checkDataExist({
    data: ReadingrecordRepository.findUniqueReadingrecord(ctx, {
      where: { readingrecord_id: input.readingrecord_id },
    }),
  });
}

// # readingrecord.create
async function createReadingrecord(
  ctx: ProtectedContext,
  input: z.infer<typeof ReadingrecordRouterSchema.createInput>,
) {
  log.trace(ctx.reqid, 'createReadingrecord', ctx.operator.user_id, input);

  return ReadingrecordRepository.createReadingrecord(ctx, {
    data: { ...input, user_id: ctx.operator.user_id },
  });
}
// # readingrecord.update
async function updateReadingrecord(
  ctx: ProtectedContext,
  input: z.infer<typeof ReadingrecordRouterSchema.updateInput>,
) {
  log.trace(ctx.reqid, 'updateReadingrecord', ctx.operator.user_id, input);

  await checkPreviousVersion({
    previous: ReadingrecordRepository.findUniqueReadingrecord(ctx, {
      where: { readingrecord_id: input.readingrecord_id },
    }),
    updated_at: input.updated_at,
  });

  return ReadingrecordRepository.updateReadingrecord(ctx, {
    data: { ...input, user_id: ctx.operator.user_id },
    where: { readingrecord_id: input.readingrecord_id },
  });
}

// # readingrecord.delete
async function deleteReadingrecord(
  ctx: ProtectedContext,
  input: z.infer<typeof ReadingrecordRouterSchema.deleteInput>,
) {
  log.trace(ctx.reqid, 'deleteReadingrecord', ctx.operator.user_id, input);

  await checkPreviousVersion({
    previous: ReadingrecordRepository.findUniqueReadingrecord(ctx, {
      where: { readingrecord_id: input.readingrecord_id },
    }),
    updated_at: input.updated_at,
  });

  return ReadingrecordRepository.deleteReadingrecord(ctx, {
    where: { readingrecord_id: input.readingrecord_id },
  });
}
