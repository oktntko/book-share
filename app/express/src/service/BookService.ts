import { dayjs } from '@book-share/lib/dayjs';
import { R } from '@book-share/lib/remeda';
import type { z } from '@book-share/lib/zod';
import { Prisma } from '@book-share/prisma/client';
import { books_v1 } from '@googleapis/books';
import { TRPCError } from '@trpc/server';
import { log } from '~/lib/log4js';
import { PublicContext } from '~/middleware/trpc';
import { BookRepository } from '~/repository/BookRepository';
import { PostRepository } from '~/repository/PostRepository';
import { MESSAGE_DATA_IS_NOT_EXIST } from '~/repository/_repository';
import { BookRouterSchema } from '~/schema/BookRouterSchema';

export const BookService = {
  listVolume,
  getVolume,
  rankingBook,
};

// # book.listVolume
async function listVolume(ctx: PublicContext, input: z.infer<typeof BookRouterSchema.listInput>) {
  log.trace(ctx.reqid, 'listVolume', input);

  const { totalItems, items } = await BookRepository.listVolume(ctx.reqid, {
    q: input.q,
    queryfield: input.queryfield,
    startIndex: input.limit * (input.page - 1),
    maxResults: input.limit,
    orderBy: input.orderBy,
    printType: input.printType,
    projection: input.projection,
  }).catch(() => ({
    totalItems: 0,
    items: [],
  }));

  return {
    total: totalItems ?? 0,
    volume_list: items ?? [],
  };
}

// # book.getVolume
async function getVolume(ctx: PublicContext, input: z.infer<typeof BookRouterSchema.getInput>) {
  log.trace(ctx.reqid, 'getBook', input);

  const volume = await BookRepository.getVolume(ctx, {
    where: { volume_id: input.volume_id },
  }).catch(() => null);

  if (!volume) {
    throw new TRPCError({ code: 'NOT_FOUND', message: MESSAGE_DATA_IS_NOT_EXIST });
  }

  return volume;
}

// # book.ranking
async function rankingBook(
  ctx: PublicContext,
  input: z.infer<typeof BookRouterSchema.rankingInput>,
) {
  log.trace(ctx.reqid, 'listPost', input);

  const where: Prisma.PostWhereInput = {};

  where.volume_id = {
    not: '',
  };

  if (input.span !== '累計') {
    where.created_at = {
      gte: dayjs()
        .subtract(1, input.span === '週間' ? 'week' : 'month')
        .startOf('day')
        .toDate(),
    };
  }

  const volumeIdList = await PostRepository.countPostGroupByVolumeId(ctx, { where });

  const volume_list: books_v1.Schema$Volume & { count: number }[] = [];
  for (const data of volumeIdList) {
    const volume = await getVolume(ctx, { volume_id: data.volume_id });
    volume_list.push(R.merge(volume, { count: data._count }));
  }

  return {
    volume_list,
  };
}
