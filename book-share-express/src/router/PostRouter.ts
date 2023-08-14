import { prisma } from '~/lib/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import { OutputPostSchema, PostRouterSchema } from '~/schema/PostRouterSchema';
import { PostService } from '~/service/PostService';

export const post = router({
  list: protectedProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.listPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  create: protectedProcedure
    .input(PostRouterSchema.createInput)
    .output(OutputPostSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.createPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  get: protectedProcedure
    .input(PostRouterSchema.getInput)
    .output(OutputPostSchema)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.getPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  update: protectedProcedure
    .input(PostRouterSchema.updateInput)
    .output(OutputPostSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.updatePost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  delete: protectedProcedure
    .input(PostRouterSchema.deleteInput)
    .output(OutputPostSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        PostService.deletePost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),
});
