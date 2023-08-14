import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/lib/prisma';
import { FileRepository } from '~/repository/FileRepository';
import { UserRepository } from '~/repository/UserRepository';
import {
  PREVIOUS_IS_NOT_FOUND_MESSAGE,
  checkDuplicate,
  checkPreviousVersion,
} from '~/repository/_';
import type { UserRouterSchema } from '~/schema/UserRouterSchema';

// # user.list
async function listUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof UserRouterSchema.listInput>,
) {
  log.trace(reqid, 'listUser', operator_id, input);

  const where: Prisma.UserWhereInput = {};
  if (input.where) {
    where.OR = [
      { username: { contains: input.where.keyword } },
      { email: { contains: input.where.keyword } },
    ];
  }

  log.debug('where', where);

  const orderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> = input.sort.map(
    ({ field, order }) => {
      if (field.includes('.')) {
        const [table, column] = field.split('.');
        return { [table]: { [column]: order } };
      } else {
        return { [field]: order };
      }
    },
  );

  const [total, user_list] = await Promise.all([
    UserRepository.countUser(reqid, prisma, where),
    UserRepository.findManyUser(reqid, prisma, where, orderBy, input.limit, input.offset),
  ]);

  return {
    total,
    user_list,
  };
}

// # user.create
async function createUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof UserRouterSchema.createInput>,
) {
  log.trace(reqid, 'createUser', operator_id, input);

  await checkRelations(reqid, prisma, input);

  await checkDuplicate({
    duplicate: UserRepository.findUniqueUser(reqid, prisma, { email: input.email }),
  });

  return UserRepository.createUser(reqid, prisma, operator_id, input);
}

// # user.get
async function getUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof UserRouterSchema.getInput>,
) {
  log.trace(reqid, 'getUser', operator_id, input);

  const user = await UserRepository.findUniqueUser(reqid, prisma, input);

  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND', message: PREVIOUS_IS_NOT_FOUND_MESSAGE });
  }

  return user;
}

// # user.update
async function updateUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof UserRouterSchema.updateInput>,
) {
  log.trace(reqid, 'updateUser', operator_id, input);

  await checkRelations(reqid, prisma, input);

  await checkPreviousVersion({
    previous: UserRepository.findUniqueUser(reqid, prisma, { user_id: input.user_id }),
    updated_at: input.updated_at,
  });

  await checkDuplicate({
    duplicate: UserRepository.findUniqueUser(reqid, prisma, { email: input.email }),
    current: { key: 'user_id', value: input.user_id },
  });

  return UserRepository.updateUser(reqid, prisma, operator_id, input, input.user_id);
}

// # user.delete
async function deleteUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof UserRouterSchema.deleteInput>,
) {
  log.trace(reqid, 'deleteUser', operator_id, input);

  await checkPreviousVersion({
    previous: UserRepository.findUniqueUser(reqid, prisma, { user_id: input.user_id }),
    updated_at: input.updated_at,
  });

  return UserRepository.deleteUser(reqid, prisma, input.user_id);
}

export const UserService = {
  listUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};

async function checkRelations(
  reqid: string,
  prisma: PrismaClient,
  {
    avatar_file_id,
  }: {
    avatar_file_id: string | null;
  },
) {
  if (avatar_file_id != null) {
    const count = await FileRepository.countFile(reqid, prisma, {
      file_id: avatar_file_id,
    });

    if (count === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '対象のファイルは既に削除されています。',
      });
    }
  }
}
