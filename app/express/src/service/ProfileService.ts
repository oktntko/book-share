import { dayjs } from '@book-share/lib/dayjs';
import type { z } from '@book-share/lib/zod';
import { TRPCError } from '@trpc/server';
import { log } from '~/lib/log4js';
import { HashPassword, OnetimePassword, SecretPassword } from '~/lib/secret';
import { ProtectedContext } from '~/middleware/trpc';
import { UserRepository } from '~/repository/UserRepository';
import { checkDataExist, checkDuplicate } from '~/repository/_repository';
import { PostRouterSchema } from '~/schema';
import type { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';

export const ProfileService = {
  getProfile,
  patchPassword,
  updateProfile,
  deleteProfile,
  generateSecret,
  enableSecret,
  disableSecret,
  heartPost,
  unheartPost,
};

// # profile.get
async function getProfile(ctx: ProtectedContext) {
  log.trace(ctx.reqid, 'getProfile', ctx.operator.user_id);

  return checkDataExist({
    data: UserRepository.findUniqueUser(ctx, {
      where: { user_id: ctx.operator.user_id },
    }),
    dataIsNotExistMessage: '該当データが見つかりません。再度ログインし直してください。',
  });
}

// # profile.update
async function patchPassword(
  ctx: ProtectedContext,
  input: z.infer<typeof ProfileRouterSchema.patchPasswordInput>,
) {
  log.trace(ctx, 'patchPassword', ctx.operator.user_id, input);

  const user = await ProfileService.getProfile(ctx);

  // 現在のパスワードの確認
  if (!HashPassword.compare(input.current_password, user.password)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'パスワードが誤っています。',
    });
  }
  // 新しいパスワードをハッシュ化
  const hashedPassword = HashPassword.hash(input.new_password);

  return UserRepository.updateUser(ctx, {
    data: { password: hashedPassword },
    where: { user_id: user.user_id },
  });
}

async function updateProfile(
  ctx: ProtectedContext,
  input: z.infer<typeof ProfileRouterSchema.patchProfileInput>,
) {
  log.trace(ctx.reqid, 'updateProfile', ctx.operator.user_id, input);

  const user = await ProfileService.getProfile(ctx);

  await checkDuplicate({
    duplicate: UserRepository.findUniqueUser(ctx, { where: { email: user.email } }),
    current: { key: 'user_id', value: user.user_id },
  });

  return UserRepository.updateUser(ctx, { data: input, where: { user_id: user.user_id } });
}

// # profile.delete
async function deleteProfile(ctx: ProtectedContext) {
  log.trace(ctx.reqid, 'deleteProfile', ctx.operator.user_id);

  return UserRepository.deleteUser(ctx, { where: { user_id: ctx.operator.user_id } });
}

// # profile.generateSecret
async function generateSecret(ctx: ProtectedContext) {
  log.trace(ctx.reqid, 'generateSecret', ctx.operator.user_id);

  const secret = OnetimePassword.generateSecret({ name: ctx.operator.email });

  const dataurl = await OnetimePassword.generateQrcodeUrl({
    secret: secret.ascii,
    name: ctx.operator.email,
  });

  // セッションに生成したシークレットを保存する
  const setting_twofa = {
    expires: dayjs().add(12, 'hour').toDate(),
    twofa_secret: SecretPassword.encrypt(secret.base32),
  };

  return { dataurl, setting_twofa };
}

// # profile.enableSecret
async function enableSecret(
  ctx: ProtectedContext,
  input: z.infer<typeof ProfileRouterSchema.enableSecretInput> & {
    setting_twofa: {
      expires: Date;
      twofa_secret: string;
    } | null;
  },
) {
  log.trace(ctx.reqid, 'enableSecret', ctx.operator.user_id, input);

  await ProfileService.getProfile(ctx); // checkDataExist

  if (!input.setting_twofa || dayjs(input.setting_twofa.expires).isBefore(dayjs())) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: '二要素認証のQRコードが発行されていないか、QRコードの有効期限が切れています。',
    });
  }

  const verified = OnetimePassword.verifyToken({
    secret: SecretPassword.decrypt(input.setting_twofa.twofa_secret),
    token: input.token,
  });

  if (!verified) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'コードが合致しません。' });
  }

  return UserRepository.updateUser(ctx, {
    data: { twofa_enable: true, twofa_secret: input.setting_twofa.twofa_secret },
    where: { user_id: ctx.operator.user_id },
  });
}

// # profile.disableSecret
async function disableSecret(ctx: ProtectedContext) {
  log.trace(ctx.reqid, 'disableSecret', ctx.operator.user_id);

  await ProfileService.getProfile(ctx); // checkDataExist

  return UserRepository.updateUser(ctx, {
    data: { twofa_enable: false, twofa_secret: '' },
    where: { user_id: ctx.operator.user_id },
  });
}

// # profile.heartPost
async function heartPost(ctx: ProtectedContext, input: z.infer<typeof PostRouterSchema.getInput>) {
  log.trace(ctx.reqid, 'heartPost', ctx.operator.user_id);

  return UserRepository.updateUser(ctx, {
    data: {
      heart_list: { connect: { post_id: input.post_id } },
    },
    where: { user_id: ctx.operator.user_id },
  });
}

// # profile.unheartPost
async function unheartPost(
  ctx: ProtectedContext,
  input: z.infer<typeof PostRouterSchema.getInput>,
) {
  log.trace(ctx.reqid, 'heartPost', ctx.operator.user_id);

  return UserRepository.updateUser(ctx, {
    data: {
      heart_list: { disconnect: { post_id: input.post_id } },
    },
    where: { user_id: ctx.operator.user_id },
  });
}
