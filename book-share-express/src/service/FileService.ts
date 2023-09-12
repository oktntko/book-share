import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { z } from 'zod';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import { FileRepository } from '~/repository/FileRepository';
import { FileRouterSchema } from '~/schema/FileRouterSchema';

// # file.list
async function listFile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof FileRouterSchema.listInput>,
) {
  log.trace(reqid, 'listFile', operator_id);

  const where: Prisma.FileWhereInput = {};
  if (input.where) {
    where.originalname = { contains: input.where.keyword };
  }

  const [total, files] = await Promise.all([
    FileRepository.countFile(reqid, prisma),
    FileRepository.findManyFile(reqid, prisma),
  ]);

  return { total, files };
}

// # file.get
async function getFile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof FileRouterSchema.getInput>,
) {
  log.trace(reqid, 'getFile', operator_id, input);

  const filedata = await FileRepository.findUniqueFile(reqid, prisma, input);
  if (!filedata) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: '削除操作が競合しています。',
    });
  }

  return filedata;
}

// # file.create
async function createFile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  file: Express.Multer.File,
) {
  log.trace(reqid, 'createFile', operator_id, file);

  const originalname = decodeURIComponent(file.originalname); // 文字化けする

  // テーブルを更新
  const filedata = await FileRepository.createFile(reqid, prisma, operator_id, {
    originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  // ストレージを更新
  const folder = FileRepository.dirpath(filedata.file_id);
  FileRepository.rmrf(folder);
  await FileRepository.writeFile(folder, originalname, file.buffer);

  return { file_id: filedata.file_id };
}

// # file.get
async function downloadFile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof FileRouterSchema.getInput>,
) {
  log.trace(reqid, 'getFile', operator_id, input);

  // テーブルからデータを取得
  const filedata = await FileRepository.findUniqueFile(reqid, prisma, input);
  if (!filedata) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: '削除操作が競合しています。',
    });
  }

  // ストレージからデータを取得
  const fullpath = FileRepository.filepath(filedata.file_id, filedata.originalname);
  return FileRepository.readFile(fullpath);
}

// # file.delete
async function deleteFile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  input: z.infer<typeof FileRouterSchema.getInput>,
) {
  log.trace(reqid, 'deleteFile', operator_id, input);

  // テーブルを更新
  const filedata = await FileRepository.deleteFile(reqid, prisma, input.file_id);

  // ストレージを更新
  const folder = FileRepository.dirpath(input.file_id);
  FileRepository.rmrf(folder);

  return filedata;
}

export const FileService = {
  listFile,
  getFile,
  createFile,
  downloadFile,
  deleteFile,
} as const;
