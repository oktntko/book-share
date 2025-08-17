import { $transaction } from '~/middleware/prisma';
import { publicProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema, PublicPostSchemaOutput } from '~/schema/PostRouterSchema';
import { PostService } from '~/service/PostService';

export const post = router({
  // post.list
  list: publicProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.listPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // post.get
  get: publicProcedure
    .input(PostRouterSchema.getInput)
    .output(PublicPostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.getPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),
});
