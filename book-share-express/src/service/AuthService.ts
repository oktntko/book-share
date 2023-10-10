import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import { HashPassword, OnetimePassword, SecretPassword } from '~/lib/secret';
import type { PrismaClient } from '~/middleware/prisma';
import { UserRepository } from '~/repository/UserRepository';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';

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

  const hashedPassword = HashPassword.hash(input.new_password);

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

  if (!user || !HashPassword.compare(input.password, user.password)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'ログインに失敗しました。メールアドレスが登録されていないか、パスワードが誤っています。',
    });
  }

  return user;
}

async function signinTwofa(
  reqid: string,
  prisma: PrismaClient,
  input: z.infer<typeof AuthRouterSchema.signinTwofaInput> & {
    auth_twofa: {
      expires: Date;
      user_id: number;
    } | null;
  },
) {
  log.debug(reqid, 'signinTwofa');

  if (!input.auth_twofa || dayjs(input.auth_twofa.expires).isBefore(dayjs())) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'ログインの有効期限が切れています。最初から操作をやり直してください。',
    });
  }

  const user = await UserRepository.findUniqueUser(reqid, prisma, {
    user_id: input.auth_twofa.user_id,
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: '該当データが見つかりません。再度ログインし直してください。',
    });
  }

  const verified = OnetimePassword.verifyToken({
    secret: SecretPassword.decrypt(user.twofa_secret),
    token: input.token,
  });

  if (!verified) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'コードが合致しません。' });
  }

  return user;
}

export const AuthService = { signup, signin, signinTwofa };
