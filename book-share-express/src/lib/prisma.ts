import { PrismaClient as PrismaOriginClient } from '@prisma/client';
import log4js from 'log4js';
import { env } from '~/lib/env';

const log = log4js.getLogger('database');

export const originPrisma = new PrismaOriginClient({
  log: ['info', 'warn', 'error', { emit: 'event', level: 'query' }],
});

originPrisma.$use(async (params, next) => {
  const before = Date.now();
  log.info(`${params.action}.${params.model} BEGIN`);
  const result = await next(params);

  const after = Date.now();
  log.info(
    `${params.action}.${params.model} END took:: ${after - before}ms`,
    env.PROD ? '' : 'RESULT::',
    env.PROD ? '' : result,
  );
  return result;
});

originPrisma.$on('query', (event) => {
  log.info('QUERY::', event.query, env.PROD ? '' : 'PARAMS::', env.PROD ? '' : event.params);
});
