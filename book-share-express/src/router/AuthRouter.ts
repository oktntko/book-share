import dayjs from 'dayjs';
import type { Session, SessionData } from 'express-session';
import { z } from '~/lib/zod';
import { prisma } from '~/middleware/prisma';
import { getUserFromSession } from '~/middleware/session';
import { publicProcedure, router } from '~/middleware/trpc';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';
import { AuthService } from '~/service/AuthService';

const AuthSchema = z.object({ auth: z.boolean() });

export const auth = router({
  signup: publicProcedure
    .input(AuthRouterSchema.signupInput)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        // セッションの再生成
        await regenerate(ctx.req.session);

        const user = await AuthService.signup(ctx.reqid, prisma, input);

        // session のプロパティに代入することで、 SessionStore#set が呼ばれる. (非同期)
        ctx.req.session.user_id = user.user_id;
      });
    }),

  signin: publicProcedure
    .input(AuthRouterSchema.signinInput)
    .output(AuthSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        // セッションの再生成
        await regenerate(ctx.req.session);

        const user = await AuthService.signin(ctx.reqid, prisma, input);

        if (user.twofa_enable) {
          // 二要素認証が有効 => ID/パスワード認証が成功したことをセッションに保存 => 二要素認証へ
          ctx.req.session.data = ctx.req.session.data ?? {};
          ctx.req.session.data.auth_twofa = {
            expires: dayjs().add(10, 'minutes').toDate(),
            user_id: user.user_id,
          };

          ctx.res.status(202);
          return { auth: false };
        } else {
          // 二要素認証が無効 => ID/パスワード認証が成功したことでログイン成功
          ctx.req.session.user_id = user.user_id;

          ctx.res.status(200);
          return { auth: true };
        }
      });
    }),

  signinTwofa: publicProcedure
    .input(AuthRouterSchema.signinTwofaInput)
    .output(AuthSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (prisma) => {
        const auth_twofa = ctx.req.session.data?.auth_twofa ?? null;

        const user = await AuthService.signinTwofa(ctx.reqid, prisma, { ...input, auth_twofa });

        // セッションの再生成
        await regenerate(ctx.req.session);

        ctx.req.session.user_id = user.user_id;

        return { auth: true };
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

  delete: publicProcedure.output(z.void()).mutation(async ({ ctx }) => {
    ctx.req.session.destroy(() => {
      /*Nothing To Do*/
    });
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
