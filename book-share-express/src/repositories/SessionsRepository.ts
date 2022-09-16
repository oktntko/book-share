import { Prisma } from "@prisma/client";
import ORM from "~/libs/ORM";
import log from "~/libs/log";

async function findUniqueSession({
  session_id,
  session_key,
}: RequireOne<Prisma.SessionWhereUniqueInput>) {
  log.info("findUniqueSession");
  return ORM.session.findUnique({
    select: {
      session_id: true,
      session_key: true,
      originalMaxAge: true,
      maxAge: true,
      expires: true,
      httpOnly: true,
      path: true,
      domain: true,
      secure: true,
      user_id: true,
    },
    where: session_id != null ? { session_id } : { session_key },
  });
}

async function upsertSession(param: Prisma.SessionUncheckedCreateInput) {
  log.info("upsertSession");
  return ORM.session.upsert({
    select: {
      session_id: true,
      session_key: true,
      originalMaxAge: true,
      maxAge: true,
      expires: true,
      httpOnly: true,
      path: true,
      domain: true,
      secure: true,
      user_id: true,
    },
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

async function deleteSession({
  session_id,
  session_key,
}: RequireOne<Prisma.SessionWhereUniqueInput>) {
  log.info("deleteSession");
  return ORM.session.delete({
    select: {
      session_id: true,
      session_key: true,
      originalMaxAge: true,
      maxAge: true,
      expires: true,
      httpOnly: true,
      path: true,
      domain: true,
      secure: true,
      user_id: true,
    },
    where: session_id != null ? { session_id } : { session_key },
  });
}

export const SessionsRepository = {
  findUniqueSession,
  upsertSession,
  deleteSession,
};
