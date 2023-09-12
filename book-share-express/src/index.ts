import { app } from '~/app';
import { env } from '~/lib/env';
import { log } from '~/lib/log4js';

const server = app.listen(env.PORT, () => {
  log.info(`App is running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});

export default server;
