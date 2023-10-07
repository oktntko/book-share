import { prisma } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import { OutputProfileSchema, ProfileRouterSchema } from '~/schema/ProfileRouterSchema';
import { ProfileService } from '~/service/ProfileService';

export const profile = router({
  get: protectedProcedure.output(OutputProfileSchema).query(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) =>
      ProfileService.getProfile(ctx.reqid, prisma, ctx.operator_id),
    );
  }),

  patchProfile: protectedProcedure
    .input(ProfileRouterSchema.patchProfileInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ProfileService.updateProfile(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  patchPassword: protectedProcedure
    .input(ProfileRouterSchema.patchPasswordInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ProfileService.patchPassword(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  delete: protectedProcedure.output(OutputProfileSchema).mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) =>
      ProfileService.deleteProfile(ctx.reqid, prisma, ctx.operator_id),
    );
  }),

  // 二要素認証関連
  generateSecret: protectedProcedure.mutation(async ({ ctx }) => {
    const data = await ProfileService.generateSecret(ctx.reqid, ctx.operator_id, ctx.user.email);

    ctx.req.session.data = ctx.req.session.data ?? {};
    ctx.req.session.data.twofa = data.twofa;

    return { dataurl: data.dataurl };
  }),

  enableSecret: protectedProcedure
    .input(ProfileRouterSchema.enableSecretInput)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        const twofa = ctx.req.session.data?.twofa;
        return ProfileService.enableSecret(ctx.reqid, prisma, ctx.operator_id, { ...input, twofa });
      });
    }),

  disableSecret: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) =>
      ProfileService.disableSecret(ctx.reqid, prisma, ctx.operator_id),
    );
  }),
});
