import { type Prisma } from '@book-share/prisma/client';
import { ProtectedContext, PublicContext } from '~/middleware/trpc';

export const UserRepository = {
  countUser,
  findManyUser,
  findUniqueUser,
  createUser,
  updateUser,
  deleteUser,
};

async function countUser(
  ctx: PublicContext,
  params: {
    where: Prisma.UserWhereInput;
  },
) {
  return ctx.prisma.user.count({
    where: params.where,
  });
}

async function findManyUser(
  ctx: PublicContext,
  params: {
    where: Prisma.UserWhereInput;
    orderBy: Prisma.UserOrderByWithRelationInput;
    take?: number;
    skip?: number;
  },
) {
  return ctx.prisma.user.findMany({
    where: params.where,
    orderBy: params.orderBy,
    take: params.take,
    skip: params.skip,
  });
}

async function findUniqueUser(
  ctx: PublicContext,
  params: {
    where: Prisma.UserWhereUniqueInput;
  },
) {
  return ctx.prisma.user.findUnique({
    where: params.where,
  });
}

async function createUser(
  ctx: PublicContext,
  params: {
    data: Omit<Prisma.UserUncheckedCreateInput, CommonColumn | 'session_list' | 'file_list'>;
  },
) {
  return ctx.prisma.user.create({
    data: {
      email: params.data.email,
      password: params.data.password,
      username: params.data.username,
    },
  });
}

async function updateUser(
  ctx: ProtectedContext,
  params: {
    where: Prisma.UserWhereUniqueInput;
    data: Partial<
      Omit<Prisma.UserUncheckedUpdateInput, CommonColumn | 'session_list' | 'file_list'>
    >;
  },
) {
  return ctx.prisma.user.update({
    data: {
      email: params.data.email,
      password: params.data.password,
      username: params.data.username,
      avatar_image: params.data.avatar_image,
      twofa_enable: params.data.twofa_enable,
      twofa_secret: params.data.twofa_secret,
    },
    where: params.where,
  });
}

async function deleteUser(
  ctx: PublicContext,
  params: {
    where: Prisma.UserWhereUniqueInput;
  },
) {
  return ctx.prisma.user.delete({
    where: params.where,
  });
}
