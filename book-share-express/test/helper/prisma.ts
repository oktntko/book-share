import { Prisma } from '@prisma/client';
import { PrismaClient } from '~/middleware/prisma';

export async function truncate(prisma: PrismaClient, ...tablenames: string[]) {
  const existsTablenames = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT
        tablename
    FROM
      pg_tables
    WHERE
      schemaname = 'bs_ut'
      AND tablename IN (${Prisma.join(tablenames)});
  `.then((data) => {
    return data.map(({ tablename }) => tablename).filter((tablename) => !tablename.startsWith('_'));
  });

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${existsTablenames.map((tablename) => `bs_ut.${tablename}`)} CASCADE;`,
  );
}

export async function rollback(prisma: PrismaClient) {
  return prisma.$executeRaw`
    ROLLBACK;
  `;
}
