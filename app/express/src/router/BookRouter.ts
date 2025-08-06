import { $transaction } from '~/middleware/prisma';
import { publicProcedure, router } from '~/middleware/trpc';
import { BookRouterSchema, VolumeSchema } from '~/schema/BookRouterSchema';
import { BookService } from '~/service/BookService';

export const book = router({
  listVolume: publicProcedure
    .input(BookRouterSchema.listInput)
    .output(BookRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) => {
        return BookService.listVolume({ ...ctx, reqid: ctx.req.reqid, prisma }, input);
      });
    }),

  getVolume: publicProcedure
    .input(BookRouterSchema.getInput)
    .output(VolumeSchema)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) => {
        return BookService.getVolume({ ...ctx, reqid: ctx.req.reqid, prisma }, input);
      });
    }),

  ranking: publicProcedure
    .input(BookRouterSchema.rankingInput)
    .output(BookRouterSchema.rankingOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) => {
        return BookService.rankingBook({ ...ctx, reqid: ctx.req.reqid, prisma }, input);
      });
    }),
});
