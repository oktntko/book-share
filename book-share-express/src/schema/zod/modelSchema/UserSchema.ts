import { z } from 'zod';
import type { SessionWithRelations } from './SessionSchema'
import type { SessionOptionalDefaultsWithRelations } from './SessionSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SessionOptionalDefaultsWithRelationsSchema } from './SessionSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

/**
 * ユーザ
 */
export const UserSchema = z.object({
  user_id: z.number().int(),
  email: z.string().trim().min(1).max(255).email(),
  username: z.string().trim().min(1).max(100),
  created_at: z.coerce.date(),
  created_by: z.number().int(),
  updated_at: z.coerce.date(),
  updated_by: z.number().int(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  user_id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  session_list: SessionWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  session_list: z.lazy(() => SessionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
  session_list: SessionOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  session_list: z.lazy(() => SessionOptionalDefaultsWithRelationsSchema).array(),
}))

export default UserSchema;
