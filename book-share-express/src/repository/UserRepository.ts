import type { Prisma, User } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/lib/prisma';

type ParamUser = Omit<User, 'user_id' | CommonColumn>;

async function countUser(reqid: string, prisma: PrismaClient, where: Prisma.UserWhereInput) {
  log.trace(reqid, 'countUser');

  return prisma.user.count({
    where,
  });
}

async function findManyUser(
  reqid: string,
  prisma: PrismaClient,
  where?: Prisma.UserWhereInput,
  orderBy?: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>,
  take?: number,
  skip?: number,
) {
  log.trace(reqid, 'findManyUser');

  return prisma.user.findMany({
    where,
    orderBy,
    take,
    skip,
  });
}

async function createUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  user: ParamUser,
) {
  log.trace(reqid, 'createUser');

  return prisma.user.create({
    include: {},
    data: {
      email: user.email,
      username: user.username,
      created_by: operator_id,
      updated_by: operator_id,
    },
  });
}

async function findUniqueUser(
  reqid: string,
  prisma: PrismaClient,
  where: RequireOne<Prisma.UserWhereUniqueInput>,
) {
  log.trace(reqid, 'findUniqueUser');

  return prisma.user.findUnique({
    where: where.user_id != null ? { user_id: where.user_id } : { email: where.email },
  });
}

async function updateUser(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  user: ParamUser,
  user_id: number,
) {
  log.trace(reqid, 'updateUser');

  return prisma.user.update({
    data: {
      email: user.email,
      username: user.username,
      updated_by: operator_id,
    },
    where: { user_id },
  });
}

async function deleteUser(reqid: string, prisma: PrismaClient, user_id: number) {
  log.trace(reqid, 'deleteUser');

  return prisma.user.delete({
    where: { user_id },
  });
}

export const UserRepository = {
  countUser,
  findManyUser,
  createUser,
  findUniqueUser,
  updateUser,
  deleteUser,
};
