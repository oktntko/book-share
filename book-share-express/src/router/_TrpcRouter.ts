import { router } from '~/middleware/trpc';
import { auth } from '~/router/AuthRouter';
import { book } from '~/router/BookRouter';
import { file } from '~/router/FileRouter';
import { post } from '~/router/PostRouter';
import { readingrecord } from '~/router/ReadingrecordRouter';
import { user } from '~/router/UserRouter';

export const TrpcRouter = router({
  auth,
  book,
  file,
  post,
  readingrecord,
  user,
});
