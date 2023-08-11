import dayjs from 'dayjs';
import type { SessionData } from 'express-session';
import { log } from '~/lib/log4js';
import type { PrismaClient } from '~/lib/prisma';
import { SessionRepository } from '~/repository/SessionRepository';

// # session.get
async function getSession(prisma: PrismaClient, session_key: string): Promise<SessionData | null> {
  log.debug('getSession', session_key);

  const foundSession = await SessionRepository.findUniqueSession(prisma, { session_key });

  if (!foundSession) {
    log.debug('Not Found Session.');
    return null;
  }

  if (dayjs(foundSession.expires).isBefore(dayjs())) {
    log.debug('Session has expired.');
    return null;
  }

  return {
    cookie: {
      originalMaxAge: foundSession.originalMaxAge,
      maxAge: foundSession.maxAge ?? undefined,
      expires: foundSession.expires,
      httpOnly: foundSession.httpOnly ?? undefined,
      path: foundSession.path ?? undefined,
      domain: foundSession.domain ?? undefined,
      secure: foundSession.secure ?? undefined,
    },
    user_id: foundSession.user_id,
  };
}

// # session.set
async function postSession(prisma: PrismaClient, session_key: string, session: SessionData) {
  log.debug('postSession', session_key);

  return SessionRepository.upsertSession(prisma, {
    session_key,
    originalMaxAge: session.cookie.originalMaxAge,
    maxAge: session.cookie.maxAge,
    expires: session.cookie.expires,
    httpOnly: session.cookie.httpOnly,
    path: session.cookie.path,
    domain: session.cookie.domain,
    secure: typeof session.cookie.secure === 'boolean' ? session.cookie.secure : false,
    user_id: session.user_id,
  });
}

// # session.destory
async function deleteSession(prisma: PrismaClient, session_key: string) {
  log.debug('deleteSession', session_key);

  const foundSession = await SessionRepository.findUniqueSession(prisma, {
    session_key,
  });

  if (foundSession == null) {
    log.debug('Not Found Session.');
  } else {
    await SessionRepository.deleteSession(prisma, { session_key });
  }
}

export const SessionService = {
  getSession,
  postSession,
  deleteSession,
};
