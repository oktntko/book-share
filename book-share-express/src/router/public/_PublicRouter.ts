import { router } from '~/middleware/trpc';
import { auth } from '~/router/public/AuthRouter';
import { book } from '~/router/public/BookRouter';
import { post } from '~/router/public/PostRouter';

export const PublicRouter = router({
  auth,
  book,
  post,
});
