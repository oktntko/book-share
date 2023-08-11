import type { Prisma } from '@prisma/client';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/lib/prisma';

async function findUniqueSession(
  prisma: PrismaClient,
  where: RequireOne<Prisma.SessionWhereUniqueInput>,
) {
  log.trace('findUniqueSession');

  return prisma.session.findUnique({
    where:
      where.session_id != null
        ? { session_id: where.session_id }
        : { session_key: where.session_key },
  });
}

async function upsertSession(prisma: PrismaClient, param: Prisma.SessionUncheckedCreateInput) {
  log.trace('upsertSession');

  return prisma.session.upsert({
    where: { session_key: param.session_key },
    create: {
      session_key: param.session_key,
      originalMaxAge: param.originalMaxAge,
      maxAge: param.maxAge,
      expires: param.expires,
      httpOnly: param.httpOnly,
      path: param.path,
      domain: param.domain,
      secure: param.secure,
      user_id: param.user_id,
    },
    update: {
      originalMaxAge: param.originalMaxAge,
      maxAge: param.maxAge,
      expires: param.expires,
      httpOnly: param.httpOnly,
      path: param.path,
      domain: param.domain,
      secure: param.secure,
      user_id: param.user_id,
    },
  });
}

async function deleteSession(
  prisma: PrismaClient,
  where: RequireOne<Prisma.SessionWhereUniqueInput>,
) {
  log.trace('deleteSession');

  return prisma.session.delete({
    where:
      where.session_id != null
        ? { session_id: where.session_id }
        : { session_key: where.session_key },
  });
}

export const SessionRepository = {
  findUniqueSession,
  upsertSession,
  deleteSession,
};
