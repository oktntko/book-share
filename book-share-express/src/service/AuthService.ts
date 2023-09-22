import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { UserRepository } from '~/repository/UserRepository';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';

export const saltOrRounds = 10;

async function signup(
  reqid: string,
  prisma: PrismaClient,
  input: z.infer<typeof AuthRouterSchema.signupInput>,
) {
  log.debug(reqid, 'signup');

  if (
    await UserRepository.findUniqueUser(reqid, prisma, {
      email: input.email,
    })
  ) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'メールアドレスは既に登録されています。',
    });
  }

  const hashedPassword = bcrypt.hashSync(input.new_password, saltOrRounds);

  return UserRepository.createUser(reqid, prisma, 0, {
    username: input.email,
    email: input.email,
    password: hashedPassword,
  });
}

async function signin(
  reqid: string,
  prisma: PrismaClient,
  input: z.infer<typeof AuthRouterSchema.signinInput>,
) {
  log.debug(reqid, 'signin');

  const user = await UserRepository.findUniqueUser(reqid, prisma, {
    email: input.email,
  });

  if (!user || !bcrypt.compareSync(input.password, user.password)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'ログインに失敗しました。メールアドレスが登録されていないか、パスワードが誤っています。',
    });
  }

  return user;
}

export const AuthService = { signup, signin };
