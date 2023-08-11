import { router } from '~/middleware/trpc';
import { auth } from '~/router/AuthRouter';
import { file } from '~/router/FileRouter';
import { user } from '~/router/UserRouter';

export const TrpcRouter = router({
  auth,
  file,
  user,
});
