import { z } from '@book-share/lib/zod';
import { $transaction } from '~/middleware/prisma';
import { protectedProcedure, router } from '~/middleware/trpc';
import { OutputProfileSchema, ProfileRouterSchema } from '~/schema/ProfileRouterSchema';
import { ProfileService } from '~/service/ProfileService';

export const profile = router({
  get: protectedProcedure.output(OutputProfileSchema).query(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) =>
      ProfileService.getProfile({ ...ctx, reqid: ctx.req.reqid, prisma }),
    );
  }),

  patchProfile: protectedProcedure
    .input(ProfileRouterSchema.patchProfileInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ProfileService.updateProfile({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  patchPassword: protectedProcedure
    .input(ProfileRouterSchema.patchPasswordInput)
    .output(OutputProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return $transaction(ctx.prisma, async (prisma) =>
        ProfileService.patchPassword({ ...ctx, reqid: ctx.req.reqid, prisma }, input),
      );
    }),

  delete: protectedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) => {
      await ProfileService.deleteProfile({ ...ctx, reqid: ctx.req.reqid, prisma });

      ctx.req.session.destroy(() => {
        /*Nothing To Do*/
      });
    });
  }),

  // 二要素認証関連
  generateSecret: protectedProcedure.mutation(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) => {
      const data = await ProfileService.generateSecret({ ...ctx, reqid: ctx.req.reqid, prisma });

      ctx.req.session.data = ctx.req.session.data ?? {};
      ctx.req.session.data.setting_twofa = data.setting_twofa;

      return { dataurl: data.dataurl };
    });
  }),

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

  disableSecret: protectedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    return $transaction(ctx.prisma, async (prisma) => {
      await ProfileService.disableSecret({ ...ctx, reqid: ctx.req.reqid, prisma });

      ctx.req.session.data = ctx.req.session.data ?? {};
      ctx.req.session.data.setting_twofa = null;
    });
  }),
});
