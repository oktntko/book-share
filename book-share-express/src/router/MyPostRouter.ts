import { protectedProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema, PostSchemaOutput } from '~/schema/PostRouterSchema';
import { PostSchema } from '~/schema/zod';
import { PostService } from '~/service/PostService';

export const myPost = router({
  list: protectedProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.listPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  create: protectedProcedure
    .input(PostRouterSchema.createInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.createPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  get: protectedProcedure
    .input(PostRouterSchema.getInput)
    .output(PostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.getMyPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  update: protectedProcedure
    .input(PostRouterSchema.updateInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.updatePost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  delete: protectedProcedure
    .input(PostRouterSchema.deleteInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.deletePost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  publish: protectedProcedure
    .input(PostRouterSchema.publishInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) =>
        PostService.publishPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),
});
