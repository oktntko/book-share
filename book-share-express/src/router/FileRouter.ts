import { TRPCError } from '@trpc/server';
import express from 'express';
import multer from 'multer';
import { prisma } from '~/middleware/prisma';
import { getUserFromSession } from '~/middleware/session';
import { protectedProcedure, router } from '~/middleware/trpc';
import { FileRouterSchema } from '~/schema/FileRouterSchema';
import FileSchema from '~/schema/zod/modelSchema/FileSchema';
import { FileService } from '~/service/FileService';

// trpc
export const file = router({
  list: protectedProcedure
    .input(FileRouterSchema.listInput)
    .output(FileRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        FileService.listFile(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  get: protectedProcedure
    .input(FileRouterSchema.getInput)
    .output(FileSchema)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        FileService.getFile(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  delete: protectedProcedure
    .input(FileRouterSchema.getInput)
    .output(FileSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        FileService.deleteFile(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),
});

// files
const upload = multer();

export const FileRouter = express.Router();

FileRouter.use(async (req, res, next) => {
  const user = await getUserFromSession(req.id, req.session.user_id, req.session.cookie.expires);

  if (!user) {
    return next(new TRPCError({ code: 'UNAUTHORIZED' }));
  }

  return next();
});

// /api/file/upload/single
FileRouter.post('/upload/single', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return next(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'ファイルが選択されていません。',
      }),
    );
  }

  const file = req.file;

  return prisma
    .$transaction(async (prisma) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const json = await FileService.createFile(req.id, prisma, req.session.user_id!, file);
      res.json(json);
    })
    .catch(next);
});

// /api/file/upload/array
FileRouter.post('/upload/array', upload.array('files'), async (req, res, next) => {
  if (!req.files || !Array.isArray(req.files)) {
    return next(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'ファイルが選択されていません。',
      }),
    );
  }

  const files = req.files;

  return prisma
    .$transaction(async (prisma) => {
      const json = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        files.map((file) => FileService.createFile(req.id, prisma, req.session.user_id!, file)),
      );
      res.json(json);
    })
    .catch(next);
});

// /api/file/download/:file_id
FileRouter.get('/download/:file_id', async (req, res, next) => {
  const file_id = req.params.file_id;

  return prisma
    .$transaction(async (prisma) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const buffer = await FileService.downloadFile(req.id, prisma, req.session.user_id!, {
        file_id,
      });
      res.send(buffer);
    })
    .catch(next);
});
