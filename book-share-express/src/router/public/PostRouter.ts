import { publicProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema, PublicPostSchemaOutput } from '~/schema/PostRouterSchema';
import { PostService } from '~/service/PostService';

export const post = router({
  list: publicProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.listPost(ctx.reqid, prisma, undefined, input),
      );
    }),

  get: publicProcedure
    .input(PostRouterSchema.getInput)
    .output(PublicPostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.getPost(ctx.reqid, prisma, undefined, input),
      );
    }),
});
