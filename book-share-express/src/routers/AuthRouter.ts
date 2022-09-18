import { Session, SessionData } from "express-session";
import { z } from "zod";
import { createRouter } from "~/context";
import { trpc } from "~/libs/trpc";
import { AuthService } from "~/services/AuthService";

export const auth = createRouter()
  .mutation("create", {
    input: z.object({
      email: z.string().email().max(255),
      password: z.string().max(255),
    }),
    resolve: async ({ input, ctx }) => {
      // セッションの再生成
      await regenerate(ctx.req.session);

      const user = await AuthService.createAuth(input);

      // session のプロパティに代入することで、 SessionStore#set が呼ばれる. (非同期)
      if (ctx.req) {
        ctx.req.session.user_id = user.user_id;
      }

      return { ok: true };
    },
  })
  .query("get", {
    resolve: async ({ ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return { ok: true };
    },
  })
  .mutation("delete", {
    resolve: async ({ ctx }) => {
      if (ctx.req) {
        ctx.req.session.destroy(() => {
          /*Nothing To Do*/
        });
      }

      return { ok: true };
    },
  });

async function regenerate(
  session: Session & Partial<SessionData>
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
