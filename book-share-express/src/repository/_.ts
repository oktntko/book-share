import { TRPCError } from '@trpc/server';
import * as R from 'remeda';

export const DUPLICATE_IS_EXISTING_MESSAGE = '重複するデータが既に存在しています。';
export const PREVIOUS_IS_NOT_FOUND_MESSAGE = '対象のデータは既に削除されています。';
export const PREVIOUS_IS_UPDATED_MESSAGE =
  '対象のデータは変更されています。最新の状態で再度実行してください。';

export async function checkDuplicate<T>(param: {
  duplicate: T | null | Promise<T | null>;
  current?: { key: keyof T; value: unknown };
  duplicateIsExistingMessage?: string;
}) {
  const data = R.isPromise(param.duplicate) ? await param.duplicate : param.duplicate;
  if (data && param.current?.value == null) {
    // 登録のとき
    // 重複データがあるだけでデータが登録できない
    throw new TRPCError({
      code: 'CONFLICT',
      message: param.duplicateIsExistingMessage || DUPLICATE_IS_EXISTING_MESSAGE,
    });
  } else if (data && param.current && data[param.current.key] !== param.current.value) {
    // 更新のとき
    // 重複データが自身と一致しないときだけデータが更新できない
    throw new TRPCError({
      code: 'CONFLICT',
      message: param.duplicateIsExistingMessage || DUPLICATE_IS_EXISTING_MESSAGE,
    });
  }
  // TODO: メッセージを変えるかも

  return data;
}

export async function checkPreviousVersion<T extends { updated_at: Date }>(param: {
  previous: T | null | Promise<T | null>;
  updated_at: string | Date;
  previousIsNotFoundMessage?: string;
  previousIsUpdatedMessage?: string;
}) {
  const data = R.isPromise(param.previous) ? await param.previous : param.previous;

  if (!data) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: param.previousIsNotFoundMessage || PREVIOUS_IS_NOT_FOUND_MESSAGE,
    });
  }

  const date = typeof param.updated_at === 'string' ? new Date(param.updated_at) : param.updated_at;

  if (data.updated_at.getTime() !== date.getTime()) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: param.previousIsUpdatedMessage || PREVIOUS_IS_UPDATED_MESSAGE,
    });
  }

  return data;
}
