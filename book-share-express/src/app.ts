import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import '~/lib/dayjs';
import { env } from '~/lib/env';
import '~/lib/log4js';
import '~/lib/zod';
import { NotFoundHandler, UnexpectedErrorHandler } from '~/middleware/error';
import { AfterLogHandler, BeforeLogHandler } from '~/middleware/log';
import { InjectRequestIdHandler } from '~/middleware/request-id';
import { SessionStore } from '~/middleware/session';
import { createContext } from '~/middleware/trpc';
import { FileRouter } from '~/router/FileRouter';
import { TrpcRouter } from '~/router/_TrpcRouter';

export const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(helmet());

app.use(InjectRequestIdHandler);
app.use(BeforeLogHandler);
app.use(AfterLogHandler);

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: env.session.SESSION_SECRET,
    name: env.session.SESSION_NAME,
    store: new SessionStore(),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 /*ms*/,
      httpOnly: true,
      domain: env.session.SESSION_DOMAIN,
      path: env.session.SESSION_PATH,
      secure: env.PROD,
    },
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: TrpcRouter,
    createContext,
  }),
);

app.use('/api/file', FileRouter);

app.use(NotFoundHandler);
app.use(UnexpectedErrorHandler);
