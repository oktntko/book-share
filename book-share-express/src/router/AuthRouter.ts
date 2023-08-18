import type { Session, SessionData } from 'express-session';
import { prisma } from '~/middleware/prisma';
import { protectedProcedure, publicProcedure, router } from '~/middleware/trpc';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';
import { OkSchema } from '~/schema/_';
import { AuthService } from '~/service/AuthService';

export const auth = router({
  create: publicProcedure
    .input(AuthRouterSchema.createInput)
    .output(OkSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        // セッションの再生成
        await regenerate(ctx.req.session);

        const user = await AuthService.createAuth(ctx.reqid, prisma, input);

        // session のプロパティに代入することで、 SessionStore#set が呼ばれる. (非同期)
        if (ctx.req) {
          ctx.req.session.user_id = user.user_id;
        }

        return { ok: true };
      });
    }),

  get: protectedProcedure.output(OkSchema).query(async () => {
    return { ok: true };
  }),

  delete: publicProcedure.output(OkSchema).mutation(async ({ ctx }) => {
    if (ctx.req) {
      ctx.req.session.destroy(() => {
        /*Nothing To Do*/
      });
    }

    return { ok: true };
  }),
});

async function regenerate(
  session: Session & Partial<SessionData>,
): Promise<(Session & Partial<SessionData>) | void> {
  return new Promise((resolve, reject) => {
    const oldsession = session.regenerate((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(oldsession);
      }
    });
  });
}
