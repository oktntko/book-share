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

  delete: protectedProcedure.output(OutputProfileSchema).mutation(async ({ ctx }) => {
    return prisma.$transaction(async (prisma) =>
      ProfileService.deleteProfile(ctx.reqid, prisma, ctx.operator_id),
    );
  }),
});
