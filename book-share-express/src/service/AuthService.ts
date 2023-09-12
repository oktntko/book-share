import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { UserRepository } from '~/repository/UserRepository';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';

async function createAuth(
  reqid: string,
  prisma: PrismaClient,
  input: z.infer<typeof AuthRouterSchema.createInput>,
) {
  log.debug(reqid, 'createAuth');

  const user = await UserRepository.findUniqueUser(reqid, prisma, {
    email: input.email,
  });
  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'ログインに失敗しました。登録されていないメールアドレスか、パスワードが一致しません。',
    });
  }

  return user;
}

export const AuthService = {
  createAuth,
};
