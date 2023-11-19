import { router } from '~/middleware/trpc';
import { file } from '~/router/FileRouter';
import { myPost } from '~/router/MyPostRouter';
import { profile } from '~/router/ProfileRouter';
import { readingrecord } from '~/router/ReadingrecordRouter';
import { PublicRouter } from '~/router/public/_PublicRouter';

export const TrpcRouter = router({
  file,
  myPost,
  profile,
  readingrecord,
  public: PublicRouter,
});
