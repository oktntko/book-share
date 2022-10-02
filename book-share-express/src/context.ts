import { typeToFlattenedError, ZodError } from "zod";
import dayjs from "~/libs/dayjs";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc, trpcAdapters } from "~/libs/trpc";
import { UsersRepository } from "~/repositories/UsersRepository";

// The app's context - is generated for each incoming request
export async function createContext(opts: trpcAdapters.CreateExpressContextOptions) {
  async function getUserFromSession() {
    if (opts.req.session.user_id) {
      if (
        !opts.req.session.cookie.expires ||
        dayjs(opts.req.session.cookie.expires).isBefore(dayjs())
      ) {
        log.debug("Session has expired.");
        return null;
      }

      return UsersRepository.findUniqueUser(ORM, { user_id: opts?.req.session.user_id });

      // セッションに user_id がなければ null
    } else {
      return null;
    }
  }

  const user = await getUserFromSession();

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

type Context = trpc.inferAsyncReturnType<typeof createContext>;

// Helper function to create a router with your app's context
export function createRouter() {
  return trpc.router<Context>().formatError(({ shape, error }) => {
    const format = {
      code: shape.code, // number
      message: shape.message, // string,
      data: {
        httpStatus: shape.data.httpStatus,
        codeName: error.code,
        path: shape.data.path,
        cause: undefined as typeToFlattenedError<any, string> | undefined,
      }, // Record<string, unknown>
    };

    if (error.code === "BAD_REQUEST" && error.cause instanceof ZodError) {
      format.message = "入力値に誤りがあります。";
      format.data.cause = error.cause.flatten();
      return format;
    } else {
      return format;
    }
  });
}

// This helper can be used anywhere in your app tree to enforce downstream procedures to be authorized.
export function createAuthorizedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    }

    log.trace(`access by ${ctx.user.user_id}`);
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

// export function createAllowedRouter(role: string) {
//   return createAuthorizedRouter().middleware(({ ctx, next }) => {
//     if (!ctx.user) {
//       throw new trpc.TRPCError({ code: "FORBIDDEN" });
//     }
//     return next({
//       ctx: {
//         ...ctx,
//         user: ctx.user,
//       },
//     });
//   });
// }
