import type { Prisma } from '@book-share/prisma/client';
import { log } from '~/lib/log4js';
import { ProtectedContext, PublicContext } from '~/middleware/trpc';
import { mergeVolume } from '~/repository/BookRepository';

export const ReadingrecordRepository = {
  countReadingrecord,
  findManyReadingrecord,
  findUniqueReadingrecord,
  createReadingrecord,
  updateReadingrecord,
  deleteReadingrecord,
};

async function countReadingrecord(
  ctx: PublicContext,
  params: {
    where: Prisma.ReadingrecordWhereInput;
  },
) {
  log.trace(ctx.reqid, 'countReadingrecord');

  return ctx.prisma.readingrecord.count({
    where: params.where,
  });
}

async function findManyReadingrecord(
  ctx: PublicContext,
  params: {
    where?: Prisma.ReadingrecordWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.ReadingrecordOrderByWithRelationInput>;
    take?: number;
    skip?: number;
  },
) {
  log.trace(ctx.reqid, 'findManyReadingrecord');

  const readingrecord_list = await ctx.prisma.readingrecord.findMany({
    where: params.where,
    orderBy: params.orderBy,
    take: params.take,
    skip: params.skip,
  });

  // Array.prototype.map() を使うと overload function の効果が消えて戻り値が Nullable になるため、
  // for of を使っている。
  const computedList = [];
  for (const readingrecord of readingrecord_list) {
    computedList.push(await mergeVolume(ctx, readingrecord));
  }

  return computedList;
}

async function findUniqueReadingrecord(
  ctx: PublicContext,
  params: {
    where: RequireOne<Prisma.ReadingrecordWhereUniqueInput>;
  },
) {
  log.trace(ctx.reqid, 'findUniqueReadingrecord');

  return ctx.prisma.readingrecord.findUnique({
    where: params.where,
  });
}

async function createReadingrecord(
  ctx: ProtectedContext,
  params: { data: Omit<Prisma.ReadingrecordUncheckedCreateInput, CommonColumn> },
) {
  log.trace(ctx.reqid, 'createReadingrecord');

  return ctx.prisma.readingrecord
    .create({
      data: {
        volume_id: params.data.volume_id,
        book_title: params.data.book_title,
        read_date: params.data.read_date,
        star: params.data.star,
        hitokoto: params.data.hitokoto,
        user_id: ctx.operator.user_id,
      },
    })
    .then((readingrecord) => mergeVolume(ctx, readingrecord));
}

async function updateReadingrecord(
  ctx: ProtectedContext,
  params: {
    where: Prisma.ReadingrecordWhereUniqueInput;
    data: Omit<Prisma.ReadingrecordUncheckedUpdateInput, CommonColumn>;
  },
) {
  log.trace(ctx.reqid, 'updateReadingrecord');

  return ctx.prisma.readingrecord
    .update({
      data: {
        volume_id: params.data.volume_id,
        book_title: params.data.book_title,
        read_date: params.data.read_date,
        star: params.data.star,
        hitokoto: params.data.hitokoto,
        user_id: ctx.operator.user_id,
      },
      where: params.where,
    })
    .then((readingrecord) => mergeVolume(ctx, readingrecord));
}

async function deleteReadingrecord(
  ctx: ProtectedContext,
  params: {
    where: Prisma.ReadingrecordWhereUniqueInput;
  },
) {
  log.trace(ctx.reqid, 'deleteReadingrecord');

  return ctx.prisma.readingrecord.delete({
    where: params.where,
  });
}
