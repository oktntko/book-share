import { z } from '~/lib/zod';

export const SessionScalarFieldEnumSchema = z.enum([
  'session_id',
  'session_key',
  'originalMaxAge',
  'maxAge',
  'signed',
  'expires',
  'httpOnly',
  'path',
  'domain',
  'secure',
  'sameSite',
  'user_id',
  'data',
  'created_at',
  'updated_at',
]);

export default SessionScalarFieldEnumSchema;
