import type { RequestHandler } from 'express';
import crypto from 'node:crypto';

declare module 'express-serve-static-core' {
  interface Request {
    id: ReturnType<typeof crypto.randomUUID>;
  }
}

export const InjectRequestIdHandler: RequestHandler = (req, res, next) => {
  req.id = crypto.randomUUID();

  return next();
};
