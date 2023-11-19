import { publicProcedure, router } from '~/middleware/trpc';
import { BookRouterSchema, VolumeSchema } from '~/schema/BookRouterSchema';
import { BookService } from '~/service/BookService';

export const book = router({
  listVolume: publicProcedure
    .input(BookRouterSchema.listInput)
    .output(BookRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return BookService.listVolume(ctx.reqid, undefined, input);
    }),

  getVolume: publicProcedure
    .input(BookRouterSchema.getInput)
    .output(VolumeSchema)
    .query(async ({ ctx, input }) => {
      return BookService.getVolume(ctx.reqid, undefined, input);
    }),

  ranking: publicProcedure
    .input(BookRouterSchema.rankingInput)
    .output(BookRouterSchema.rankingOutput)
    .query(async ({ ctx, input }) => {
      return BookService.rankingBook(ctx.reqid, undefined, input);
    }),
});
