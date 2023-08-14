import { router } from '~/middleware/trpc';
import { auth } from '~/router/AuthRouter';
import { book } from '~/router/BookRouter';
import { file } from '~/router/FileRouter';
import { post } from '~/router/PostRouter';
import { user } from '~/router/UserRouter';

export const TrpcRouter = router({
  auth,
  file,
  book,
  post,
  user,
});
