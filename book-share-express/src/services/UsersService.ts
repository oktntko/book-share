import { Prisma } from "@prisma/client";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { UsersRepository } from "~/repositories/UsersRepository";
import { PrismaClient } from "~/type";

// # GET /users
async function listUsers(input: {
  keyword: string;
  sort: ("email" | "created_at" | "username")[];
  limit: number;
  offset: number;
}) {
  log.debug("listUsers", input);

  const where: Prisma.UserWhereInput = {};
  if (input.keyword) {
    where.OR = [
      {
        username: {
          contains: input.keyword,
        },
      },
      {
        email: {
          contains: input.keyword,
        },
      },
    ];
  }

  log.debug("where", where);

  const orderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> = input.sort.map((key) => {
    switch (key) {
      case "email":
        return {
          email: "asc",
        };
      case "created_at":
        return {
          created_at: "desc",
        };
      case "username":
        return {
          username: "asc",
        };
    }
  });

  const [total, users] = await Promise.all([
    UsersRepository.countUsers(ORM, where),
    UsersRepository.findManyUsers(ORM, where, orderBy, input.limit, input.offset),
  ]);

  return {
    total,
    users,
  };
}

// # POST /users
async function createUser(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    email: string;
    username: string;
  }
) {
  return UsersRepository.createUser(prisma, operator_id, {
    email: input.email,
    username: input.username,
  });
}

// # GET /users/:user_id
async function findUniqueUser(user_id: number) {
  return UsersRepository.findUniqueUser(ORM, { user_id });
}

// # PUT /users/:user_id
async function updateUser(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    user_id: number;
    email: string;
    username: string;
  }
) {
  return UsersRepository.updateUser(prisma, operator_id, input.user_id, {
    email: input.email,
    username: input.username,
  });
}

// # DELETE /users/:user_id
async function deleteUser(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    user_id: number;
  }
) {
  return UsersRepository.deleteUser(prisma, operator_id, input.user_id);
}

export const UsersService = {
  listUsers,
  createUser,
  findUniqueUser,
  updateUser,
  deleteUser,
};
