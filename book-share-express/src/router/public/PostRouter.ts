import { prisma } from '~/middleware/prisma';
import { publicProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema, PostSchemaOutput } from '~/schema/PostRouterSchema';
import { PostService } from '~/service/PostService';

export const post = router({
  list: publicProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.listPost(ctx.reqid, prisma, undefined, input),
      );
    }),

  get: publicProcedure
    .input(PostRouterSchema.getInput)
    .output(PostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.getPost(ctx.reqid, prisma, undefined, input),
      );
    }),
});
