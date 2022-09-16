import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc } from "~/libs/trpc";
import { UsersRepository } from "~/repositories/UsersRepository";

async function createAuth(input: { email: string; password: string }) {
  log.debug("createAuth");
  const user = await UsersRepository.findUniqueUserPassword(ORM, { email: input.email });
  if (!user) {
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message:
        "ログインに失敗しました。登録されていないメールアドレスか、パスワードが一致しません。",
    });
  }

  const isValidPassword = input.password === user.password;
  if (!isValidPassword) {
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message:
        "ログインに失敗しました。登録されていないメールアドレスか、パスワードが一致しません。",
    });
  }

  return {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
  };
}

export const AuthService = {
  createAuth,
};
