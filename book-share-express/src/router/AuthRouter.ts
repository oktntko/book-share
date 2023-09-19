import type { Session, SessionData } from 'express-session';
import { z } from '~/lib/zod';
import { prisma } from '~/middleware/prisma';
import { getUserFromSession } from '~/middleware/session';
import { publicProcedure, router } from '~/middleware/trpc';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';
import { AuthService } from '~/service/AuthService';

const OkSchema = z.object({ ok: z.literal(true) });
const AuthSchema = z.object({ auth: z.boolean() });

export const auth = router({
  signup: publicProcedure
    .input(AuthRouterSchema.signupInput)
    .output(OkSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        // セッションの再生成
        await regenerate(ctx.req.session);

        const user = await AuthService.signup(ctx.reqid, prisma, input);

        // session のプロパティに代入することで、 SessionStore#set が呼ばれる. (非同期)
        if (ctx.req) {
          ctx.req.session.user_id = user.user_id;
        }

        return { ok: true };
      });
    }),

  signin: publicProcedure
    .input(AuthRouterSchema.signinInput)
    .output(OkSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        // セッションの再生成
        await regenerate(ctx.req.session);

        const user = await AuthService.signin(ctx.reqid, prisma, input);

        // session のプロパティに代入することで、 SessionStore#set が呼ばれる. (非同期)
        if (ctx.req) {
          ctx.req.session.user_id = user.user_id;
        }

        return { ok: true };
      });
    }),

  get: publicProcedure.output(AuthSchema).query(async ({ ctx }) => {
    const user = await getUserFromSession(
      ctx.reqid,
      ctx.req.session.user_id,
      ctx.req.session.cookie.expires,
    );

    return { auth: !!user };
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
