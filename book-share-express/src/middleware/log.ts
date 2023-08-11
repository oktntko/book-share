import type { Handler, Request, RequestHandler, Response } from 'express';
import log4js from 'log4js';

const access = log4js.getLogger('access');

// "GET /api/trpc/status.list HTTP/1.1" 200 - "http://localhost:5173/setting/status"
export const BeforeLogHandler: RequestHandler = (req, res, next) => {
  access.trace(formatAccessInfo('BEGIN', req));
  return next();
};

access.mark;
export const AfterLogHandler: Handler = log4js.connectLogger(access, {
  level: 'auto',
  statusRules: [
    { from: 200, to: 299, level: 'info' },
    { from: 300, to: 399, level: 'info' },
    { from: 400, to: 499, level: 'warn' },
  ],
  format: (req, res) => formatAccessInfo('END', req, res),
});

function formatAccessInfo(prefix: string, req: Request, res?: Response) {
  return `${req.id} ${prefix} - "${req.method} ${decodeURIComponent(req.originalUrl || req.url)}" ${
    res?.statusCode ?? '( )'
  } - ${req.headers['x-forwarded-for'] || req.ip}`;
}
