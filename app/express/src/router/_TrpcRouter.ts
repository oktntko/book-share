import { router } from '~/middleware/trpc';
import { auth } from '~/router/AuthRouter';
import { book } from '~/router/BookRouter';
import { file } from '~/router/FileRouter';
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
