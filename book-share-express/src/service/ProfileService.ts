import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import bcrypt from 'bcrypt';
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
  input:
    | z.infer<typeof ProfileRouterSchema.patchAvatarFileIdInput>
    | z.infer<typeof ProfileRouterSchema.patchProfileInput>,
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

export const ProfileService = {
  getProfile,
  patchPassword,
  updateProfile,
  deleteProfile,
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
