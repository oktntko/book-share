import { PostSchema } from '@book-share/prisma/schema';
import { $transaction } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema, PostSchemaOutput } from '~/schema/PostRouterSchema';
import { PostService } from '~/service/PostService';

export const mypost = router({
  // mypost.list
  list: protectedProcedure
    .input(PostRouterSchema.listInput)
    .output(PostRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.listMyPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // mypost.get
  get: protectedProcedure
    .input(PostRouterSchema.getInput)
    .output(PostSchemaOutput)
    .query(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.getMyPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // mypost.create
  create: protectedProcedure
    .input(PostRouterSchema.createInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.createPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // mypost.update
  update: protectedProcedure
    .input(PostRouterSchema.updateInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.updatePost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // mypost.delete
  delete: protectedProcedure
    .input(PostRouterSchema.deleteInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.deletePost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // mypost.publish
  publish: protectedProcedure
    .input(PostRouterSchema.publishInput)
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        PostService.publishPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),
});
