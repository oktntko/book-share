import { createCallerFactory, router } from '~/middleware/trpc';
import { auth } from '~/router/AuthRouter';
import { book } from '~/router/BookRouter';
import { file, FileRouter } from '~/router/FileRouter';
import { post } from '~/router/PostRouter';
import { profile } from '~/router/ProfileRouter';
import { readingrecord } from '~/router/ReadingrecordRouter';

export const TrpcRouter = router({
  auth,
  book,
  file,
  post,
  profile,
  readingrecord,
});

export const ExpressRouter = [FileRouter];

export const createCaller = createCallerFactory(TrpcRouter);

export type TrpcPaths = DotTrpcKeys<(typeof TrpcRouter)['_def']['record']>;

type IsProcedure<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _def: any;
}
  ? true
  : false;

type DotTrpcKeys<T> = {
  [K in keyof T]: K extends string
    ? IsProcedure<T[K]> extends true
      ? K
      : DotTrpcKeys<T[K]> extends infer D
        ? D extends string
          ? K extends string
            ? D extends string
              ? `${K}.${D}`
              : never
            : never
          : never
        : never
    : never;
}[keyof T];
