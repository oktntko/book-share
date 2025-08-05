import log4js from 'log4js';
import { env } from '~/lib/env';

log4js.configure({
  appenders: {
    application: {
      type: 'file',
      filename: 'logs/application.log',
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: 'utf-8',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} (%c) [%-5p] %m (%f{1}:%l)',
      },
    },
    access: {
      type: 'file',
      filename: 'logs/access.log',
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: 'utf-8',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} (%c) [%-5p] %m',
      },
    },
    database: {
      type: 'file',
      filename: 'logs/database.log',
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: 'utf-8',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} (%c) [%-5p] %m',
      },
    },
    stdout: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} (%c) [%[%-5p%]] %[%m%] (%f{1}:%l)',
      },
    },
  },
  categories: {
    default: {
      appenders: env.PROD ? ['application'] : ['stdout', 'application'],
      level: env.PROD ? 'info' : 'all',
      enableCallStack: true,
    },
    access: {
      appenders: env.PROD ? ['access'] : ['stdout', 'access'],
      level: env.PROD ? 'info' : 'all',
      enableCallStack: true,
    },
    database: {
      appenders: env.PROD ? ['database'] : ['stdout', 'database'],
      level: env.PROD ? 'info' : 'all',
      enableCallStack: true,
    },
  },
});

export const log = log4js.getLogger();
