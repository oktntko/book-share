import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { env } from '~/lib/env';
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

  patchAvatarFileId: protectedProcedure
    .input(ProfileRouterSchema.patchAvatarFileIdInput)
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

  // 二要素認証関連
  generateSecret: protectedProcedure.mutation(async ({ ctx }) => {
    const secret = speakeasy.generateSecret({
      length: 32,
      name: ctx.user.email,
      issuer: env.APP_NAME,
    });

    const url = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: encodeURIComponent(ctx.user.email),
      issuer: env.APP_NAME,
    });

    const dataurl = await qrcode.toDataURL(url);

    // セッションに生成したシークレットを保存する
    const twofa = {
      expires: dayjs().add(1, 'hour').toDate(),
      secret: secret.base32,
    };
    ctx.req.session.data = ctx.req.session.data ?? {};
    ctx.req.session.data.twofa = twofa;

    return { dataurl };
  }),

  enableSecret: protectedProcedure
    .input(
      z.object({
        token: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        const twofa = ctx.req.session.data?.twofa;
        if (!twofa || Date.now() > twofa.expires.getDate()) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              '二要素認証のバーコードが発行されていないか、バーコードの有効期限が切れています。',
          });
        }

        const verified = speakeasy.totp.verify({
          secret: twofa.secret,
          encoding: 'base32',
          token: input.token,
        });

        if (verified) {
          await prisma.user.update({
            data: {
              twofa_enable: true,
              twofa_secret: twofa.secret,
            },
            where: { user_id: ctx.operator_id },
          });
        } else {
          throw new TRPCError({ code: 'BAD_REQUEST', message: '検証コードが合致しません。' });
        }
      });
    }),

  disableSecret: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        data: {
          twofa_enable: false,
          twofa_secret: '',
        },
        where: { user_id: ctx.operator_id },
      });
    });
  }),

  delete: protectedProcedure.output(OutputProfileSchema).mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) =>
      ProfileService.deleteProfile(ctx.reqid, prisma, ctx.operator_id),
    );
  }),
});
