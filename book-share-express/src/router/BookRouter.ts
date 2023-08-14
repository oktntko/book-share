import { protectedProcedure, router } from '~/middleware/trpc';
import { BookRouterSchema, VolumeSchema } from '~/schema/BookRouterSchema';
import { BookService } from '~/service/BookService';

export const book = router({
  listVolume: protectedProcedure
    .input(BookRouterSchema.listInput)
    .output(BookRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return BookService.listVolume(ctx.reqid, ctx.operator_id, input);
    }),

  getVolume: protectedProcedure
    .input(BookRouterSchema.getInput)
    .output(VolumeSchema)
    .query(async ({ ctx, input }) => {
      return BookService.getVolume(ctx.reqid, ctx.operator_id, input);
    }),
});
