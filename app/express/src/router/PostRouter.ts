import { PostSchema } from '@book-share/prisma/schema';
import { $transaction } from '~/middleware/prisma';
import { protectedProcedure, publicProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema, PostSchemaOutput } from '~/schema/PostRouterSchema';
import { PostService } from '~/service/PostService';

export const post = router({
  list: publicProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.listPost({ ...ctx, reqid: ctx.req.reqid, prisma, public: true }, input),
      );
    }),

  getMyPostList: protectedProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.listPost({ ...ctx, reqid: ctx.req.reqid, prisma, public: false }, input),
      );
    }),

  get: publicProcedure
    .input(PostRouterSchema.getInput)
    .output(PostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.getPost({ ...ctx, reqid: ctx.req.reqid, prisma, public: true }, input),
      );
    }),

  getMyPost: protectedProcedure
    .input(PostRouterSchema.getInput)
    .output(PostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.getPost({ ...ctx, reqid: ctx.req.reqid, prisma, public: false }, input),
      );
    }),

  create: protectedProcedure
    .input(PostRouterSchema.createInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.createPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  update: protectedProcedure
    .input(PostRouterSchema.updateInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.updatePost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  delete: protectedProcedure
    .input(PostRouterSchema.deleteInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.deletePost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  publish: protectedProcedure
    .input(PostRouterSchema.publishInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.publishPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),
});
