import { z } from '@book-share/lib/zod';
import { $transaction } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import { PostRouterSchema } from '~/schema';
import { OutputProfileSchema, ProfileRouterSchema } from '~/schema/ProfileRouterSchema';
import { ProfileService } from '~/service/ProfileService';

export const profile = router({
  // profile.get
  get: protectedProcedure.output(OutputProfileSchema).query(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) =>
      ProfileService.getProfile({ ...ctx, reqid: ctx.req.reqid, prisma }),
    );
  }),

  // profile.patchProfile
  patchProfile: protectedProcedure
    .input(ProfileRouterSchema.patchProfileInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ProfileService.updateProfile({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // profile.patchPassword
  patchPassword: protectedProcedure
    .input(ProfileRouterSchema.patchPasswordInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ProfileService.patchPassword({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // profile.delete
  delete: protectedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) => {
      await ProfileService.deleteProfile({ ...ctx, reqid: ctx.req.reqid, prisma });

      ctx.req.session.destroy(() => {
        /*Nothing To Do*/
      });
    });
  }),

  heartPost: protectedProcedure
    .input(PostRouterSchema.getInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ProfileService.heartPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  unheartPost: protectedProcedure
    .input(PostRouterSchema.getInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ProfileService.unheartPost({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  // 二要素認証関連
  // profile.generateSecret
  generateSecret: protectedProcedure.mutation(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) => {
      const data = await ProfileService.generateSecret({ ...ctx, reqid: ctx.req.reqid, prisma });

      ctx.req.session.data = ctx.req.session.data ?? {};
      ctx.req.session.data.setting_twofa = data.setting_twofa;

      return { dataurl: data.dataurl };
    });
  }),

  // profile.enableSecret
  enableSecret: protectedProcedure
    .input(ProfileRouterSchema.enableSecretInput)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) => {
        const setting_twofa = ctx.req.session.data?.setting_twofa ?? null;

        await ProfileService.enableSecret(
          { ...ctx, reqid: ctx.req.reqid, prisma },
          {
            ...input,
            setting_twofa,
          },
        );

        ctx.req.session.data = ctx.req.session.data ?? {};
        ctx.req.session.data.setting_twofa = null;
      });
    }),

  // profile.disableSecret
  disableSecret: protectedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) => {
      await ProfileService.disableSecret({ ...ctx, reqid: ctx.req.reqid, prisma });

      ctx.req.session.data = ctx.req.session.data ?? {};
      ctx.req.session.data.setting_twofa = null;
    });
  }),
});
