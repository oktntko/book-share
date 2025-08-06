import { $transaction } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import {
  ReadingrecordRouterSchema,
  ReadingrecordSchemaOutput,
} from '~/schema/ReadingrecordRouterSchema';
import { ReadingrecordSchema } from '@book-share/prisma/schema';
import { ReadingrecordService } from '~/service/ReadingrecordService';

export const readingrecord = router({
  list: protectedProcedure
    .input(ReadingrecordRouterSchema.listInput)
    .output(ReadingrecordRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ReadingrecordService.listReadingrecord({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  create: protectedProcedure
    .input(ReadingrecordRouterSchema.createInput)
    .output(ReadingrecordSchemaOutput)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ReadingrecordService.createReadingrecord({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  get: protectedProcedure
    .input(ReadingrecordRouterSchema.getInput)
    .output(ReadingrecordSchema)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ReadingrecordService.getReadingrecord({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  update: protectedProcedure
    .input(ReadingrecordRouterSchema.updateInput)
    .output(ReadingrecordSchemaOutput)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ReadingrecordService.updateReadingrecord({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  delete: protectedProcedure
    .input(ReadingrecordRouterSchema.deleteInput)
    .output(ReadingrecordSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ReadingrecordService.deleteReadingrecord({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),
});
