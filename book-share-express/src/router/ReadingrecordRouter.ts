import { prisma } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import {
  ReadingrecordRouterSchema,
  ReadingrecordSchemaOutput,
} from '~/schema/ReadingrecordRouterSchema';
import { ReadingrecordSchema } from '~/schema/zod';
import { ReadingrecordService } from '~/service/ReadingrecordService';

export const readingrecord = router({
  list: protectedProcedure
    .input(ReadingrecordRouterSchema.listInput)
    .output(ReadingrecordRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ReadingrecordService.listReadingrecord(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  create: protectedProcedure
    .input(ReadingrecordRouterSchema.createInput)
    .output(ReadingrecordSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ReadingrecordService.createReadingrecord(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  get: protectedProcedure
    .input(ReadingrecordRouterSchema.getInput)
    .output(ReadingrecordSchemaOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ReadingrecordService.getReadingrecord(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  update: protectedProcedure
    .input(ReadingrecordRouterSchema.updateInput)
    .output(ReadingrecordSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ReadingrecordService.updateReadingrecord(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  delete: protectedProcedure
    .input(ReadingrecordRouterSchema.deleteInput)
    .output(ReadingrecordSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ReadingrecordService.deleteReadingrecord(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),
});
