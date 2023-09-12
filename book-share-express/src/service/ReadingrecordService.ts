import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { ReadingrecordRepository } from '~/repository/ReadingrecordRepository';
import { PREVIOUS_IS_NOT_FOUND_MESSAGE, checkPreviousVersion } from '~/repository/_';
import type { ReadingrecordRouterSchema } from '~/schema/ReadingrecordRouterSchema';

// # readingrecord.list
async function listReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ReadingrecordRouterSchema.listInput>,
) {
  log.trace(reqid, 'listReadingrecord', operator_id, input);

  const where: Prisma.ReadingrecordWhereInput = {};
  where.user_id = operator_id;

  if (input.where.keyword) {
    where.OR = [
      { book_title: { contains: input.where.keyword } },
      { hitokoto: { contains: input.where.keyword } },
    ];
  }

  log.debug('where', where);

  const orderBy: Prisma.ReadingrecordOrderByWithRelationInput = input.sort;

  const [total, readingrecord_list] = await Promise.all([
    ReadingrecordRepository.countReadingrecord(reqid, prisma, where),
    ReadingrecordRepository.findManyReadingrecord(
      reqid,
      prisma,
      where,
      orderBy,
      input.limit,
      input.offset,
    ),
  ]);

  return {
    total,
    readingrecord_list,
  };
}

// # readingrecord.create
async function createReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ReadingrecordRouterSchema.createInput>,
) {
  log.trace(reqid, 'createReadingrecord', operator_id, input);

  return ReadingrecordRepository.createReadingrecord(reqid, prisma, operator_id, {
    ...input,
    user_id: operator_id,
  });
}

// # readingrecord.get
async function getReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ReadingrecordRouterSchema.getInput>,
) {
  log.trace(reqid, 'getReadingrecord', operator_id, input);

  const readingrecord = await ReadingrecordRepository.findUniqueReadingrecord(reqid, prisma, {
    readingrecord_id: input.readingrecord_id,
  });

  if (!readingrecord) {
    throw new TRPCError({ code: 'NOT_FOUND', message: PREVIOUS_IS_NOT_FOUND_MESSAGE });
  }

  return readingrecord;
}

// # readingrecord.update
async function updateReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ReadingrecordRouterSchema.updateInput>,
) {
  log.trace(reqid, 'updateReadingrecord', operator_id, input);

  await checkPreviousVersion({
    previous: ReadingrecordRepository.findUniqueReadingrecord(reqid, prisma, {
      readingrecord_id: input.readingrecord_id,
    }),
    updated_at: input.updated_at,
  });

  return ReadingrecordRepository.updateReadingrecord(
    reqid,
    prisma,
    operator_id,
    { ...input, user_id: operator_id },
    input.readingrecord_id,
  );
}

// # readingrecord.delete
async function deleteReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ReadingrecordRouterSchema.deleteInput>,
) {
  log.trace(reqid, 'deleteReadingrecord', operator_id, input);

  await checkPreviousVersion({
    previous: ReadingrecordRepository.findUniqueReadingrecord(reqid, prisma, {
      readingrecord_id: input.readingrecord_id,
    }),
    updated_at: input.updated_at,
  });

  return ReadingrecordRepository.deleteReadingrecord(reqid, prisma, input.readingrecord_id);
}

export const ReadingrecordService = {
  listReadingrecord,
  createReadingrecord,
  getReadingrecord,
  updateReadingrecord,
  deleteReadingrecord,
};
