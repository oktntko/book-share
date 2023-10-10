import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { log } from '~/lib/log4js';
import { HashPassword, OnetimePassword, SecretPassword } from '~/lib/secret';
import type { PrismaClient } from '~/middleware/prisma';
import { FileRepository } from '~/repository/FileRepository';
import { UserRepository } from '~/repository/UserRepository';
import { checkDuplicate } from '~/repository/_';
import type { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';

// # profile.get
async function getProfile(reqid: string, prisma: PrismaClient, operator_id: number) {
  log.trace(reqid, 'getProfile', operator_id);

  const user = await UserRepository.findUniqueUser(reqid, prisma, { user_id: operator_id });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: '該当データが見つかりません。再度ログインし直してください。',
    });
  }

  return user;
}

// # profile.update
async function patchPassword(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ProfileRouterSchema.patchPasswordInput>,
) {
  log.trace(reqid, 'patchPassword', operator_id, input);

  const user = await UserRepository.findUniqueUser(reqid, prisma, { user_id: operator_id });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: '該当データが見つかりません。再度ログインし直してください。',
    });
  }

  // 現在のパスワードの確認
  if (!HashPassword.compare(input.current_password, user.password)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'パスワードが誤っています。',
    });
  }
  // 新しいパスワードをハッシュ化
  const hashedPassword = HashPassword.hash(input.new_password);

  return UserRepository.updateUser(
    reqid,
    prisma,
    operator_id,
    { password: hashedPassword },
    user.user_id,
  );
}

async function updateProfile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ProfileRouterSchema.patchProfileInput>,
) {
  log.trace(reqid, 'updateProfile', operator_id, input);

  const user = await UserRepository.findUniqueUser(reqid, prisma, { user_id: operator_id });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: '該当データが見つかりません。再度ログインし直してください。',
    });
  }

  await checkRelations(reqid, prisma, user);

  await checkDuplicate({
    duplicate: UserRepository.findUniqueUser(reqid, prisma, { email: user.email }),
    current: { key: 'user_id', value: user.user_id },
  });

  return UserRepository.updateUser(reqid, prisma, operator_id, input, user.user_id);
}

// # profile.delete
async function deleteProfile(reqid: string, prisma: PrismaClient, operator_id: number) {
  log.trace(reqid, 'deleteProfile', operator_id);

  return UserRepository.deleteUser(reqid, prisma, operator_id);
}

// # profile.generateSecret
async function generateSecret(reqid: string, operator_id: number, email: string) {
  log.trace(reqid, 'generateSecret', operator_id, email);

  const secret = OnetimePassword.generateSecret({ name: email });

  const dataurl = await OnetimePassword.generateQrcodeUrl({
    secret: secret.ascii,
    name: email,
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
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof ProfileRouterSchema.enableSecretInput> & {
    setting_twofa: {
      expires: Date;
      twofa_secret: string;
    } | null;
  },
) {
  log.trace(reqid, 'enableSecret', operator_id, input);

  if (!input.setting_twofa || dayjs(input.setting_twofa.expires).isBefore(dayjs())) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: '二要素認証のQRコードが発行されていないか、QRコードの有効期限が切れています。',
    });
  }

  const user = await UserRepository.findUniqueUser(reqid, prisma, { user_id: operator_id });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: '該当データが見つかりません。再度ログインし直してください。',
    });
  }

  const verified = OnetimePassword.verifyToken({
    secret: SecretPassword.decrypt(input.setting_twofa.twofa_secret),
    token: input.token,
  });

  if (!verified) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'コードが合致しません。' });
  }

  return UserRepository.updateUser(
    reqid,
    prisma,
    operator_id,
    { twofa_enable: true, twofa_secret: input.setting_twofa.twofa_secret },
    operator_id,
  );
}

// # profile.disableSecret
async function disableSecret(reqid: string, prisma: PrismaClient, operator_id: number) {
  log.trace(reqid, 'disableSecret', operator_id);

  const user = await UserRepository.findUniqueUser(reqid, prisma, { user_id: operator_id });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: '該当データが見つかりません。再度ログインし直してください。',
    });
  }

  return UserRepository.updateUser(
    reqid,
    prisma,
    operator_id,
    { twofa_enable: false, twofa_secret: '' },
    operator_id,
  );
}

export const ProfileService = {
  getProfile,
  patchPassword,
  updateProfile,
  deleteProfile,
  generateSecret,
  enableSecret,
  disableSecret,
};

async function checkRelations(
  reqid: string,
  prisma: PrismaClient,
  {
    avatar_file_id,
  }: {
    avatar_file_id: string | null;
  },
) {
  if (avatar_file_id != null) {
    const count = await FileRepository.countFile(reqid, prisma, {
      file_id: avatar_file_id,
    });

    if (count === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '対象のファイルは既に削除されています。',
      });
    }
  }
}
