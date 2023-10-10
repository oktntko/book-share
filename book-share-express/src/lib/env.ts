export const env = {
  APP_NAME: process.env.APP_NAME || 'Book Share',
  get NODE_ENV() {
    if (process.env.NODE_ENV === 'production') {
      return 'production';
    } else {
      return 'development';
    }
  },
  get PROD() {
    return process.env.NODE_ENV === 'production';
  },
  PORT: Number(process.env.PORT || 8080),
  session: {
    SESSION_SECRET: process.env.SESSION_SECRET || 'SESSION_SECRET',
    SESSION_NAME: process.env.SESSION_NAME || 'SESSION_NAME',
    SESSION_DOMAIN: process.env.SESSION_DOMAIN || undefined,
    SESSION_PATH: process.env.SESSION_PATH || '/',
  },
  secret: {
    SECRET_KEY: process.env.SECRET_KEY || '6vTCQwmAwCs4XrybYIeRKCu5gh581AE=',
  },
} as const;
