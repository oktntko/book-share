import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dayjs from 'dayjs';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { env } from '~/lib/env';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { FileRepository } from '~/repository/FileRepository';
import { UserRepository } from '~/repository/UserRepository';
import { checkDuplicate } from '~/repository/_';
import type { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';
import { saltOrRounds } from './AuthService';

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
  if (!bcrypt.compareSync(input.current_password, user.password)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'パスワードが誤っています。',
    });
  }
  // 新しいパスワードをハッシュ化
  const hashedPassword = bcrypt.hashSync(input.new_password, saltOrRounds);

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

  const secret = speakeasy.generateSecret({
    length: 32,
    name: email,
    issuer: env.APP_NAME,
  });

  const url = speakeasy.otpauthURL({
    secret: secret.ascii,
    label: encodeURIComponent(email),
    issuer: env.APP_NAME,
  });

  const dataurl = await qrcode.toDataURL(url);

  // セッションに生成したシークレットを保存する
  const setting_twofa = {
    expires: dayjs().add(12, 'hour').toDate(),
    twofa_secret: encrypt(secret.base32),
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

  const verified = speakeasy.totp.verify({
    secret: decrypt(input.setting_twofa.twofa_secret),
    encoding: 'base32',
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

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;
const PASSWORD_LENGTH = 23;

const PASSWORD = crypto.randomBytes(PASSWORD_LENGTH).toString('base64');

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, PASSWORD, iv);

  return Buffer.concat([iv, cipher.update(Buffer.from(text)), cipher.final()]).toString('base64');
}

export function decrypt(data: string) {
  const buff = Buffer.from(data, 'base64');

  const iv = buff.subarray(0, IV_LENGTH);
  const encData = buff.subarray(IV_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, PASSWORD, iv);

  return Buffer.concat([decipher.update(encData), decipher.final()]).toString('utf8');
}
