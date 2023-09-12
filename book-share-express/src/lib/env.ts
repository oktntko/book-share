export const env = {
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
    DOMAIN: process.env.DOMAIN || undefined,
  },
} as const;
