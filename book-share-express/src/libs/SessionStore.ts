/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionData, Store } from "express-session";
import log from "~/libs/log";
import { SessionsService } from "~/services/SessionsService";

/**
 * https://github.com/microsoft/TypeScript-Node-Starter/blob/master/src/types/express-session-types.d.ts
 *
 * Naming this file express-session.d.ts causes imports from "express-session"
 * to reference this file and not the node_modules package.
 */
declare module "express-session" {
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
  async get(sid: string, callback: (err?: any, session?: SessionData | null) => void) {
    log.debug("SessionStore#get", sid);
    try {
      const session = await SessionsService.getSession(sid);
      callback(null, session);
    } catch (err) {
      log.warn(err);
      callback();
    }
  }

  /** Upsert a session in the store given a session ID and `SessionData` */
  async set(sid: string, session: SessionData, callback?: (err?: any) => void) {
    log.debug("SessionStore#set", sid);
    try {
      await SessionsService.postSession(sid, session);
      callback?.();
    } catch (err) {
      log.warn(err);
      callback?.(err);
    }
  }

  /** Destroys the dession with the given session ID. */
  async destroy(sid: string, callback?: (err?: any) => void) {
    log.debug("SessionStore#destroy", sid);
    try {
      await SessionsService.deleteSession(sid);
      callback?.();
    } catch (err) {
      log.warn(err);
      callback?.();
    }
  }
}
