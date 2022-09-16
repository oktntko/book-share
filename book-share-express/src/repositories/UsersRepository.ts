import { Prisma, User } from "@prisma/client";
import dayjs from "~/libs/dayjs";
import log from "~/libs/log";
import { trpc } from "~/libs/trpc";
import { PrismaClient } from "~/type";

export type ParamUser = Omit<
  User,
  "user_id" | "password" | "created_at" | "created_by" | "updated_at" | "updated_by"
>;

async function countUsers(prisma: PrismaClient, where: Prisma.UserWhereInput) {
  log.info("countUsers");

  return prisma.user.count({
    where,
  });
}

async function findManyUsers(
  prisma: PrismaClient,
  where: Prisma.UserWhereInput,
  orderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> = { username: "asc" },
  take?: number,
  skip?: number
) {
  log.info("findManyUsers");

  return prisma.user.findMany({
    select: {
      user_id: true,
      email: true,
      username: true,
      updated_at: true,
      updated_by: true,
    },
    where,
    orderBy,
    take,
    skip,
  });
}

async function createUser(prisma: PrismaClient, operator_id: number, user: ParamUser) {
  log.debug("createUser", operator_id);

  return prisma.user.create({
    select: {
      user_id: true,
      email: true,
      username: true,
      updated_at: true,
      updated_by: true,
    },
    data: {
      email: user.email,
      username: user.username,
      password: user.email, // TODO
      created_by: operator_id,
      updated_by: operator_id,
    },
  });
}

async function findUniqueUser(
  prisma: PrismaClient,
  { user_id, email }: RequireOne<Prisma.UserWhereUniqueInput>
) {
  log.info("findUniqueUser");

  return prisma.user.findUnique({
    select: {
      user_id: true,
      email: true,
      username: true,
      updated_at: true,
      updated_by: true,
    },
    where: user_id != null ? { user_id } : { email },
  });
}

async function updateUser(
  prisma: PrismaClient,
  operator_id: number,
  user_id: number,
  user: ParamUser
) {
  log.debug("updateUser", operator_id);

  return prisma.user.update({
    select: {
      user_id: true,
      email: true,
      username: true,
      updated_at: true,
      updated_by: true,
    },
    data: {
      email: user.email,
      username: user.username,
      password: user.email, // TODO
      updated_by: operator_id,
    },
    where: { user_id },
  });
}

async function deleteUser(prisma: PrismaClient, operator_id: number, user_id: number) {
  log.debug("deleteUser", operator_id);

  return prisma.user.delete({
    select: {
      user_id: true,
      email: true,
      username: true,
      updated_at: true,
      updated_by: true,
    },
    where: { user_id },
  });
}

async function findUniqueUserPassword(
  prisma: PrismaClient,
  { user_id, email }: RequireOne<Prisma.UserWhereUniqueInput>
) {
  log.info("findUniqueUserPassword");

  return prisma.user.findUnique({
    select: {
      user_id: true,
      email: true,
      username: true,
      password: true,
      updated_at: true,
      updated_by: true,
    },
    where: user_id != null ? { user_id } : { email },
  });
}

async function checkDuplicate(
  prisma: PrismaClient,
  where: RequireOne<Prisma.UserWhereUniqueInput>,
  user_id?: number
) {
  const duplicate = await findUniqueUser(prisma, where);
  if (duplicate && (user_id == null || duplicate.user_id !== user_id)) {
    throw new trpc.TRPCError({
      code: "CONFLICT",
      message: "Data already Registered, please refresh.",
    });
  }

  return duplicate;
}

async function checkPreviousVersion(
  prisma: PrismaClient,
  where: RequireOne<Prisma.UserWhereUniqueInput>,
  updated_at: string
) {
  const previous = await findUniqueUser(prisma, where);

  if (!previous) {
    throw new trpc.TRPCError({
      code: "CONFLICT",
      message: "Data has been Deleted, please refresh.",
    });
  } else if (!dayjs(previous.updated_at).isSame(updated_at)) {
    throw new trpc.TRPCError({
      code: "CONFLICT",
      message: "Data has been Updated, please refresh and try again.",
    });
  }

  return previous;
}

export const UsersRepository = {
  countUsers,
  findManyUsers,
  createUser,
  findUniqueUser,
  updateUser,
  deleteUser,
  //
  findUniqueUserPassword,
  checkDuplicate,
  checkPreviousVersion,
};
