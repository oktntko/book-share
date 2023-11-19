import { z } from '~/lib/zod';
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

  delete: protectedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) => {
      await ProfileService.deleteProfile(ctx.reqid, prisma, ctx.operator_id);

      ctx.req.session.destroy(() => {
        /*Nothing To Do*/
      });
    });
  }),

  // 二要素認証関連
  generateSecret: protectedProcedure.mutation(async ({ ctx }) => {
    const data = await ProfileService.generateSecret(ctx.reqid, ctx.operator_id, ctx.user.email);

    ctx.req.session.data = ctx.req.session.data ?? {};
    ctx.req.session.data.setting_twofa = data.setting_twofa;

    return { dataurl: data.dataurl };
  }),

  enableSecret: protectedProcedure
    .input(ProfileRouterSchema.enableSecretInput)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        const setting_twofa = ctx.req.session.data?.setting_twofa ?? null;

        await ProfileService.enableSecret(ctx.reqid, prisma, ctx.operator_id, {
          ...input,
          setting_twofa,
        });

        ctx.req.session.data = ctx.req.session.data ?? {};
        ctx.req.session.data.setting_twofa = null;
      });
    }),

  disableSecret: protectedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) => {
      await ProfileService.disableSecret(ctx.reqid, prisma, ctx.operator_id);

      ctx.req.session.data = ctx.req.session.data ?? {};
      ctx.req.session.data.setting_twofa = null;
    });
  }),

  stockPost: protectedProcedure
    .input(z.number().int())
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) =>
      ProfileService.stockPost(ctx.reqid, prisma, ctx.operator_id, input),
    ),

  unstockPost: protectedProcedure
    .input(z.number().int())
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ProfileService.unstockPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),

  heartPost: protectedProcedure
    .input(z.number().int())
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) =>
      ProfileService.heartPost(ctx.reqid, prisma, ctx.operator_id, input),
    ),

  unheartPost: protectedProcedure
    .input(z.number().int())
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) =>
        ProfileService.unheartPost(ctx.reqid, prisma, ctx.operator_id, input),
      );
    }),
});
