import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import { BookRepository } from '~/repository/BookRepository';
import { PREVIOUS_IS_NOT_FOUND_MESSAGE } from '~/repository/_';
import { BookRouterSchema } from '~/schema/BookRouterSchema';

// # book.listVolume
async function listVolume(
  reqid: string,
  operator_id: number,
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
  operator_id: number,
  input: z.infer<typeof BookRouterSchema.getInput>,
) {
  log.trace(reqid, 'getBook', operator_id, input);

  const volume = await BookRepository.getVolume(reqid, input.volume_id).catch(() => null);

  if (!volume) {
    throw new TRPCError({ code: 'NOT_FOUND', message: PREVIOUS_IS_NOT_FOUND_MESSAGE });
  }

  return volume;
}

export const BookService = {
  listVolume,
  getVolume,
};
