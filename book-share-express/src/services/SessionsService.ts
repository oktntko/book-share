import { SessionData } from "express-session";
import dayjs from "~/libs/dayjs";
import log from "~/libs/log";
import { SessionsRepository } from "~/repositories/SessionsRepository";

// # session.get
async function getSession(sid: string): Promise<SessionData | null> {
  log.debug("getSession", sid);
  const foundSession = await SessionsRepository.findUniqueSession({ session_key: sid });

  if (!foundSession) {
    log.debug("Not Found Session.");
    return null;
  }

  if (dayjs(foundSession.expires).isBefore(dayjs())) {
    log.debug("Session has expired.");
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
async function postSession(sid: string, session: SessionData) {
  log.debug("postSession", sid);
  return SessionsRepository.upsertSession({
    session_key: sid,
    originalMaxAge: session.cookie.originalMaxAge,
    maxAge: session.cookie.maxAge,
    expires: session.cookie.expires,
    httpOnly: session.cookie.httpOnly,
    path: session.cookie.path,
    domain: session.cookie.domain,
    secure: typeof session.cookie.secure === "boolean" ? session.cookie.secure : false,
    user_id: session.user_id,
  });
}

// # session.destory
async function deleteSession(sid: string) {
  log.debug("deleteSession", sid);
  const foundSession = await SessionsRepository.findUniqueSession({ session_key: sid });

  if (foundSession == null) {
    log.debug("Not Found Session.");
  } else {
    await SessionsRepository.deleteSession({ session_key: sid });
  }
}

export const SessionsService = {
  getSession,
  postSession,
  deleteSession,
};
