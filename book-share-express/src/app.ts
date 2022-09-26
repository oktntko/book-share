import express from "express";
import session from "express-session";
import helmet from "helmet";
import log from "~/libs/log";
import appLog from "~/libs/log";
import { SessionStore } from "~/libs/SessionStore";
import { trpcAdapters } from "~/libs/trpc";
import { router } from "~/routers/AppRouter";
import { createContext } from "~/context";

const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(helmet());

app.use(
  session({
    secret: "6V3mteKhd232paRt",
    name: `riww5UfgrGUtygck`,
    store: new SessionStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 /*ms*/,
      httpOnly: true,
      domain: process.env.DOMAIN || undefined,
      secure: process.env.PROD ? true : false,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  "/trpc",
  trpcAdapters.createExpressMiddleware({
    router,
    createContext,
    onError({ type, path, input, error }) {
      log.error(type, path, input);
      log.error(error);
    },
  })
);

app.listen(8080, () => {
  appLog.info(`App is running at http://localhost:8080 in ${"debug"} mode`);
});

export const viteNodeApp = app;
