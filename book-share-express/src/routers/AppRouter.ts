import { createRouter } from "~/context";
import { accessLog } from "~/libs/log";
import { auth } from "~/routers/AuthRouter";
import { books } from "~/routers/BooksRouter";
import { drafts } from "~/routers/DraftsRouter";
import { posts } from "~/routers/PostsRouter";
import { users } from "~/routers/UsersRouter";
import { volumes } from "~/routers/VolumesRouter";

export const router = createRouter()
  .middleware(async ({ path, type, next }) => {
    accessLog.trace(`${path} ${type}`, path, type);

    const start = Date.now();
    const result = await next();
    const duration = Date.now() - start;

    if (result.ok) {
      accessLog.trace(`${path} ${type} ${duration}[ms]`);
    } else {
      accessLog.warn(`${path} ${type} ${duration}[ms]`);
    }

    return result;
  })
  .merge("auth.", auth)
  .merge("books.", books)
  .merge("drafts.", drafts)
  .merge("posts.", posts)
  .merge("users.", users)
  .merge("volumes.", volumes);

// export type definition of API
export type AppRouter = typeof router;
