import type { File, Prisma } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/middleware/prisma';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { cwd } from 'process';

////////////////////////////////////////////////
// trpc
////////////////////////////////////////////////
type ParamFile = Omit<File, 'file_id' | CommonColumn>;

async function countFile(reqid: string, prisma: PrismaClient, where?: Prisma.FileWhereInput) {
  log.trace(reqid, 'countFile');

  return prisma.file.count({
    where,
  });
}

async function findManyFile(
  reqid: string,
  prisma: PrismaClient,
  where?: Prisma.FileWhereInput,
  orderBy?: Prisma.Enumerable<Prisma.FileOrderByWithRelationInput>,
  take?: number,
  skip?: number,
) {
  log.trace(reqid, 'findManyFile');

  return prisma.file.findMany({
    where,
    orderBy,
    take,
    skip,
  });
}

async function createFile(
  reqid: string,
  prisma: PrismaClient,
  operator_id: number,
  file: ParamFile,
) {
  log.trace(reqid, 'createFile');

  return prisma.file.create({
    data: {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      created_by: operator_id,
      updated_by: operator_id,
    },
  });
}

async function findUniqueFile(
  reqid: string,
  prisma: PrismaClient,
  where: RequireOne<Prisma.FileWhereUniqueInput>,
) {
  log.trace(reqid, 'findUniqueFile');

  return prisma.file.findUnique({
    where: { file_id: where.file_id },
  });
}

async function deleteFile(reqid: string, prisma: PrismaClient, file_id: string) {
  log.trace(reqid, 'deleteFile');

  return prisma.file.delete({
    where: { file_id },
  });
}

////////////////////////////////////////////////
// file
////////////////////////////////////////////////
const STORAGE = `${cwd()}/.userstorage`;

function dirpath(file_id: string) {
  return path.resolve(STORAGE, file_id);
}
function filepath(file_id: string, filename: string) {
  return path.resolve(STORAGE, file_id, filename);
}

function readdir(dirpath: string) {
  log.debug('readdir', dirpath);
  if (fs.existsSync(dirpath)) {
    return fs.readdirSync(dirpath).map((filename) => path.join(dirpath, filename));
  }
  return [];
}

function rmrf(anypath: string) {
  log.debug('rmrf', anypath);
  if (fs.existsSync(anypath)) {
    fs.rmSync(anypath, { recursive: true, force: true });
  }
}

async function readFile(filepath: string) {
  log.debug('readFile', filepath);
  if (fs.existsSync(filepath)) {
    return fsPromises.readFile(filepath);
  }
  return null;
}

async function writeFile(dirpath: string, filename: string, buffer: Buffer) {
  log.debug('writeFile', dirpath, filename);
  fs.mkdirSync(dirpath, { recursive: true });

  const filepath = path.join(dirpath, filename);
  return fsPromises.writeFile(filepath, buffer);
}

export const FileRepository = {
  // trpc
  countFile,
  findManyFile,
  createFile,
  findUniqueFile,
  deleteFile,
  // file
  dirpath,
  filepath,
  readdir,
  rmrf,
  readFile,
  writeFile,
} as const;
