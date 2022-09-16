import log4js from "log4js";

log4js.configure({
  appenders: {
    application: {
      type: "file",
      filename: "logs/application.log",
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} (%z) [%-5p] %m (%f{1}:%l)",
      },
    },
    access: {
      type: "file",
      filename: "logs/access.log",
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} (%z) [%-5p] %m",
      },
    },
    db: {
      type: "file",
      filename: "logs/db.log",
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} (%z) [%-5p] %m",
      },
    },
    stdout: {
      type: "stdout",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} (%z) [%[%-5p%]] %[%m%] (%f{1}:%l)",
      },
    },
  },
  categories: {
    default: {
      appenders: process.env.PROD ? ["application"] : ["stdout", "application"],
      level: process.env.PROD ? "info" : "all",
      enableCallStack: true,
    },
    access: {
      appenders: process.env.PROD ? ["access"] : ["stdout", "application", "access"],
      level: process.env.PROD ? "info" : "all",
      enableCallStack: true,
    },
    db: {
      appenders: process.env.PROD ? ["db"] : ["stdout", "application", "db"],
      level: process.env.PROD ? "info" : "all",
      enableCallStack: true,
    },
  },
});

// * app log
export const appLog = log4js.getLogger();
export const accessLog = log4js.getLogger("access");
export const dbLog = log4js.getLogger("db");

appLog.debug("Logger initialized.");

export default appLog;

export function accessLogMessage(params: {
  method: string;
  url: string;
  httpVersion: string;
  ip: string;
  referer?: string;
  ua?: string;
  statusCode?: number;
}) {
  return `"${params.method} ${params.url} HTTP/${params.httpVersion}" ${
    params.statusCode == null ? "( )" : params.statusCode
  } - ${params.ip} "${params.referer}" ${params.ua}`;
}
