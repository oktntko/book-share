import type { ErrorRequestHandler, RequestHandler } from 'express';
import { log } from '~/lib/log4js';

// NOT FOUND ERROR
export const NotFoundHandler: RequestHandler = (req, res, next) => {
  if (res.headersSent) {
    return next();
  }

  res.status(404).send({
    json: {
      error: {
        code: -32004,
        message: 'アクセス先が見つかりません。',
        data: {
          httpStatus: 404,
          code: 'NOT_FOUND',
        },
      },
    },
  });
};

// UNEXPECTED ERROR
export const UnexpectedErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  log.error(err);
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send({
    json: {
      error: {
        code: -32700,
        message: 'システムエラーが発生しました。',
        data: {
          httpStatus: 500,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
    },
  });
};
