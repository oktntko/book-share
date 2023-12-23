import { publicProcedure, router } from '~/middleware/trpc';
import { BookRouterSchema, VolumeSchema } from '~/schema/BookRouterSchema';
import { BookService } from '~/service/BookService';

export const book = router({
  listVolume: publicProcedure
    .input(BookRouterSchema.listInput)
    .output(BookRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        BookService.listVolume(ctx.reqid, prisma, undefined, input),
      );
    }),

  getVolume: publicProcedure
    .input(BookRouterSchema.getInput)
    .output(VolumeSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        BookService.getVolume(ctx.reqid, prisma, undefined, input),
      );
    }),

  ranking: publicProcedure
    .input(BookRouterSchema.rankingInput)
    .output(BookRouterSchema.rankingOutput)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        BookService.rankingBook(ctx.reqid, prisma, undefined, input),
      );
    }),
});
