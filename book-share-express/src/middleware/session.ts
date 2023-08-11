import dayjs from 'dayjs';
import { SessionData, Store } from 'express-session';
import { log } from '~/lib/log4js';
import { prisma } from '~/lib/prisma';
import { UserRepository } from '~/repository/UserRepository';
import { SessionService } from '~/service/SessionService';

/**
 * https://github.com/microsoft/TypeScript-Node-Starter/blob/master/src/types/express-session-types.d.ts
 *
 * Naming this file express-session.d.ts causes imports from "express-session"
 * to reference this file and not the node_modules package.
 */
declare module 'express-session' {
  interface SessionData {
    user_id?: number | null;
  }
}

export class SessionStore extends Store {
  /**
   * Gets the session from the store given a session ID and passes it to `callback`.
   *
   * The `session` argument should be a `Session` object if found, otherwise `null` or `undefined` if the session was not found and there was no error.
   * A special case is made when `error.code === 'ENOENT'` to act like `callback(null, null)`.
   */
  async get(sid: string, callback: (err?: unknown, session?: SessionData | null) => void) {
    log.debug('SessionStore#get', sid);
    try {
      const session = await SessionService.getSession(prisma, sid);
      callback(null, session);
    } catch (err) {
      callback(err);
    }
  }

  /** Upsert a session in the store given a session ID and `SessionData` */
  async set(sid: string, session: SessionData, callback?: (err?: unknown) => void) {
    log.debug('SessionStore#set', sid);
    try {
      await SessionService.postSession(prisma, sid, session);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  /** Destroys the dession with the given session ID. */
  async destroy(sid: string, callback?: (err?: unknown) => void) {
    log.debug('SessionStore#destroy', sid);
    try {
      await SessionService.deleteSession(prisma, sid);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }
}

export async function getUserFromSession(
  reqid: string,
  user_id?: number | null,
  expires?: Date | null | undefined,
) {
  if (user_id) {
    if (!expires || dayjs(expires).isBefore(dayjs())) {
      log.debug('Session has expired.');
      return null;
    }

    return UserRepository.findUniqueUser(reqid, prisma, { user_id });

    // セッションに user_id がなければ null
  } else {
    return null;
  }
}
