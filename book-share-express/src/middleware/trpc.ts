import type { inferAsyncReturnType } from '@trpc/server';
import { initTRPC, TRPCError } from '@trpc/server';
import type * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getUserFromSession } from '~/middleware/session';

// The app's context - is generated for each incoming request
export async function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  return {
    req: opts.req,
    reqid: opts.req.id,
    res: opts.res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    return {
      code: opts.shape.code, // TRPC_ERROR_CODE_NUMBER
      message:
        opts.error.code === 'INTERNAL_SERVER_ERROR'
          ? 'システムエラーが発生しました。'
          : opts.error.code === 'BAD_REQUEST' && opts.error.cause instanceof ZodError
          ? '入力値に誤りがあります。'
          : opts.shape.message, // string,
      data: {
        httpStatus: opts.shape.data.httpStatus,
        code: opts.error.code, // TRPC_ERROR_CODE_KEY
        path: opts.shape.data.path,
        cause:
          opts.error.code === 'BAD_REQUEST' && opts.error.cause instanceof ZodError
            ? opts.error.cause.flatten()
            : undefined,
      },
    };
  },
  transformer: superjson, // Date to Date
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

export const publicProcedure = procedure;

/**
 * Reusable middleware that checks if users are authenticated.
 **/
const isAuthed = middleware(async ({ next, ctx }) => {
  const user = await getUserFromSession(
    ctx.reqid,
    ctx.req.session.user_id,
    ctx.req.session.cookie.expires,
  );

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      operator_id: user.user_id,
      user: {
        user_id: user.user_id,
        email: user.email,
      },
    },
  });
});

export const protectedProcedure = publicProcedure.use(isAuthed);
