import { dayjs } from '@book-share/lib/dayjs';
import type { z } from '@book-share/lib/zod';
import { TRPCError } from '@trpc/server';
import { log } from '~/lib/log4js';
import { HashPassword, OnetimePassword, SecretPassword } from '~/lib/secret';
import { PublicContext } from '~/middleware/trpc';
import { UserRepository } from '~/repository/UserRepository';
import { checkDataExist, checkDuplicate } from '~/repository/_repository';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';

export const AuthService = {
  signup,
  signin,
  signinTwofa,
};

async function signup(ctx: PublicContext, input: z.infer<typeof AuthRouterSchema.signupInput>) {
  log.trace(ctx.reqid, 'signup', input);

  await checkDuplicate({
    duplicate: UserRepository.findUniqueUser(ctx, {
      where: { email: input.email },
    }),
    duplicateIsExistingMessage: 'メールアドレスは既に登録されています。',
  });

  const hashedPassword = HashPassword.hash(input.new_password);

  return UserRepository.createUser(ctx, {
    data: {
      username: input.email,
      email: input.email,
      password: hashedPassword,
    },
  });
}

async function signin(ctx: PublicContext, input: z.infer<typeof AuthRouterSchema.signinInput>) {
  log.trace(ctx.reqid, 'signup', input);

  const user = await UserRepository.findUniqueUser(ctx, {
    where: { email: input.email },
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
  ctx: PublicContext,
  input: z.infer<typeof AuthRouterSchema.signinTwofaInput> & {
    auth_twofa: {
      expires: Date;
      user_id: number;
    } | null;
  },
) {
  log.trace(ctx.reqid, 'signinTwofa', input);

  if (!input.auth_twofa || dayjs(input.auth_twofa.expires).isBefore(dayjs())) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'ログインの有効期限が切れています。最初から操作をやり直してください。',
    });
  }

  const user = await checkDataExist({
    data: UserRepository.findUniqueUser(ctx, {
      where: { user_id: input.auth_twofa.user_id },
    }),
    dataIsNotExistMessage: 'ログインの有効期限が切れています。最初から操作をやり直してください。',
  });

  const verified = OnetimePassword.verifyToken({
    secret: SecretPassword.decrypt(user.twofa_secret),
    token: input.token,
  });

  if (!verified) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'コードが合致しません。',
    });
  }

  return user;
}
