import { z } from '~/lib/zod';
import type { UserWithRelations } from './UserSchema';
import type { UserOptionalDefaultsWithRelations } from './UserSchema';
import { UserWithRelationsSchema } from './UserSchema';
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema';

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  session_id: z.number().int(),
  session_key: z.string(),
  /**
   * express-session
   */
  originalMaxAge: z.number().int().nullable(),
  maxAge: z.number().int().nullable(),
  signed: z.boolean().nullable(),
  expires: z.coerce.date(),
  httpOnly: z.boolean().nullable(),
  path: z.string(),
  domain: z.string(),
  secure: z.boolean().nullable(),
  sameSite: z.boolean().nullable(),
  /**
   * custom
   */
  user_id: z.number().int().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;

/////////////////////////////////////////
// SESSION OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const SessionOptionalDefaultsSchema = SessionSchema.merge(
  z.object({
    session_id: z.number().int().optional(),
    expires: z.coerce.date().optional(),
    path: z.string().optional(),
    domain: z.string().optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
);

export type SessionOptionalDefaults = z.infer<typeof SessionOptionalDefaultsSchema>;

/////////////////////////////////////////
// SESSION RELATION SCHEMA
/////////////////////////////////////////

export type SessionRelations = {
  user?: UserWithRelations | null;
};

export type SessionWithRelations = z.infer<typeof SessionSchema> & SessionRelations;

export const SessionWithRelationsSchema: z.ZodType<SessionWithRelations> = SessionSchema.merge(
  z.object({
    user: z.lazy(() => UserWithRelationsSchema).nullable(),
  }),
);

/////////////////////////////////////////
// SESSION OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type SessionOptionalDefaultsRelations = {
  user?: UserOptionalDefaultsWithRelations | null;
};

export type SessionOptionalDefaultsWithRelations = z.infer<typeof SessionOptionalDefaultsSchema> &
  SessionOptionalDefaultsRelations;

export const SessionOptionalDefaultsWithRelationsSchema: z.ZodType<SessionOptionalDefaultsWithRelations> =
  SessionOptionalDefaultsSchema.merge(
    z.object({
      user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).nullable(),
    }),
  );

export default SessionSchema;
