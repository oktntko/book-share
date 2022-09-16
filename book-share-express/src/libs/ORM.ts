import { PrismaClient } from "@prisma/client";
import { dbLog } from "~/libs/log";

const ORM = new PrismaClient({
  log: ["info", { emit: "event", level: "query" }, "warn", "error"],
});

ORM.$use(async (params, next) => {
  const result = await next(params);
  dbLog.debug("RESULT::", result);
  return result;
});

ORM.$on("query", (event) => {
  dbLog.info("QUERY::", event.query);
  dbLog.debug("PARAMS::", event.params, "DURATION::", `${event.duration} ms`);
});

export default ORM;
