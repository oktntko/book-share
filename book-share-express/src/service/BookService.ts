import { books_v1 } from '@googleapis/books';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import * as R from 'remeda';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import { prisma } from '~/middleware/prisma';
import { BookRepository } from '~/repository/BookRepository';
import { PostRepository } from '~/repository/PostRepository';
import { checkDataExist } from '~/repository/_';
import { BookRouterSchema } from '~/schema/BookRouterSchema';

// # book.listVolume
async function listVolume(
  reqid: string,
  operator_id: number | undefined,
  input: z.infer<typeof BookRouterSchema.listInput>,
) {
  log.trace(reqid, 'listVolume', operator_id, input);

  const { totalItems, items } = await BookRepository.listVolume(reqid, input).catch(() => ({
    totalItems: 0,
    items: [],
  }));

  return {
    total: totalItems ?? 0,
    volume_list: items ?? [],
  };
}

// # book.getVolume
async function getVolume(
  reqid: string,
  operator_id: number | undefined,
  input: z.infer<typeof BookRouterSchema.getInput>,
) {
  log.trace(reqid, 'getVolume', operator_id, input);

  return checkDataExist({
    data: BookRepository.getVolume(reqid, input.volume_id).catch(() => null),
  });
}

// # book.ranking
async function rankingBook(
  reqid: string,
  operator_id: number | undefined,
  input: z.infer<typeof BookRouterSchema.rankingInput>,
) {
  log.trace(reqid, 'listPost', operator_id, input);

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

  const volumeIdList = await PostRepository.countPostGroupByVolumeId(reqid, prisma, where);

  const volume_list: books_v1.Schema$Volume & { count: number }[] = [];
  for (const data of volumeIdList) {
    const volume = await getVolume(reqid, operator_id, { volume_id: data.volume_id });
    volume_list.push(R.merge(volume, { count: data._count }));
  }

  return {
    volume_list,
  };
}

export const BookService = {
  listVolume,
  getVolume,
  rankingBook,
};
