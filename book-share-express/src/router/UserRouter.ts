import { prisma } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import { OutputUserSchema, UserRouterSchema } from '~/schema/UserRouterSchema';
import { UserService } from '~/service/UserService';

export const user = router({
  list: protectedProcedure
    .input(UserRouterSchema.listInput)
    .output(UserRouterSchema.listOutput)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        UserService.listUser(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  create: protectedProcedure
    .input(UserRouterSchema.createInput)
    .output(OutputUserSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        UserService.createUser(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  get: protectedProcedure
    .input(UserRouterSchema.getInput)
    .output(OutputUserSchema)
    .query(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        UserService.getUser(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  update: protectedProcedure
    .input(UserRouterSchema.updateInput)
    .output(OutputUserSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        UserService.updateUser(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  delete: protectedProcedure
    .input(UserRouterSchema.deleteInput)
    .output(OutputUserSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        UserService.deleteUser(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),
});
