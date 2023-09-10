import type { Prisma, Readingrecord } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';

type ParamReadingrecord = Omit<Readingrecord, 'readingrecord_id' | CommonColumn>;

async function countReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  where: Prisma.ReadingrecordWhereInput,
) {
  log.trace(reqid, 'countReadingrecord');

  return prisma.readingrecord.count({
    where,
  });
}

async function findManyReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  where?: Prisma.ReadingrecordWhereInput,
  orderBy?: Prisma.Enumerable<Prisma.ReadingrecordOrderByWithRelationInput>,
  take?: number,
  skip?: number,
) {
  log.trace(reqid, 'findManyReadingrecord');

  return prisma.readingrecord.findMany({
    where,
    orderBy,
    take,
    skip,
  });
}

async function createReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  readingrecord: ParamReadingrecord,
) {
  log.trace(reqid, 'createReadingrecord');

  return prisma.readingrecord.create({
    include: {},
    data: {
      volume_id: readingrecord.volume_id,
      book_title: readingrecord.book_title,
      read_at: readingrecord.read_at,
      star: readingrecord.star,
      hitokoto: readingrecord.hitokoto,
      user_id: operator_id,
    },
  });
}

async function findUniqueReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  where: RequireOne<Prisma.ReadingrecordWhereUniqueInput>,
) {
  log.trace(reqid, 'findUniqueReadingrecord');

  return prisma.readingrecord.findUnique({
    where: { readingrecord_id: where.readingrecord_id },
  });
}

async function updateReadingrecord(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  readingrecord: ParamReadingrecord,
  readingrecord_id: number,
) {
  log.trace(reqid, 'updateReadingrecord');

  return prisma.readingrecord.update({
    data: {
      volume_id: readingrecord.volume_id,
      book_title: readingrecord.book_title,
      star: readingrecord.star,
      hitokoto: readingrecord.hitokoto,
      user_id: operator_id,
    },
    where: { readingrecord_id },
  });
}

async function deleteReadingrecord(reqid: string, prisma: PrismaClient, readingrecord_id: number) {
  log.trace(reqid, 'deleteReadingrecord');

  return prisma.readingrecord.delete({
    where: { readingrecord_id },
  });
}

export const ReadingrecordRepository = {
  countReadingrecord,
  findManyReadingrecord,
  createReadingrecord,
  findUniqueReadingrecord,
  updateReadingrecord,
  deleteReadingrecord,
};
