import { z } from '~/lib/zod';
import type { FileWithRelations } from './FileSchema';
import type { FileOptionalDefaultsWithRelations } from './FileSchema';
import type { SessionWithRelations } from './SessionSchema';
import type { SessionOptionalDefaultsWithRelations } from './SessionSchema';
import type { PostWithRelations } from './PostSchema';
import type { PostOptionalDefaultsWithRelations } from './PostSchema';
import type { ReadingrecordWithRelations } from './ReadingrecordSchema';
import type { ReadingrecordOptionalDefaultsWithRelations } from './ReadingrecordSchema';
import { FileWithRelationsSchema } from './FileSchema';
import { FileOptionalDefaultsWithRelationsSchema } from './FileSchema';
import { SessionWithRelationsSchema } from './SessionSchema';
import { SessionOptionalDefaultsWithRelationsSchema } from './SessionSchema';
import { PostWithRelationsSchema } from './PostSchema';
import { PostOptionalDefaultsWithRelationsSchema } from './PostSchema';
import { ReadingrecordWithRelationsSchema } from './ReadingrecordSchema';
import { ReadingrecordOptionalDefaultsWithRelationsSchema } from './ReadingrecordSchema';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

/**
 * ユーザ
 */
export const UserSchema = z.object({
  user_id: z.number().int(),
  /**
   * アバターファイルID
   */
  avatar_file_id: z.string().nullable(),
  email: z.string().trim().min(1).max(255).email(),
  password: z.string().trim().min(1).max(255),
  username: z.string().trim().min(1).max(100),
  created_at: z.coerce.date(),
  created_by: z.number().int(),
  updated_at: z.coerce.date(),
  updated_by: z.number().int(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(
  z.object({
    user_id: z.number().int().optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
);

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>;

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  avatar_image?: FileWithRelations | null;
  session_list: SessionWithRelations[];
  post_list: PostWithRelations[];
  readingrecord_list: ReadingrecordWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations;

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(
  z.object({
    avatar_image: z.lazy(() => FileWithRelationsSchema).nullable(),
    session_list: z.lazy(() => SessionWithRelationsSchema).array(),
    post_list: z.lazy(() => PostWithRelationsSchema).array(),
    readingrecord_list: z.lazy(() => ReadingrecordWithRelationsSchema).array(),
  }),
);

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
  avatar_image?: FileOptionalDefaultsWithRelations | null;
  session_list: SessionOptionalDefaultsWithRelations[];
  post_list: PostOptionalDefaultsWithRelations[];
  readingrecord_list: ReadingrecordOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> &
  UserOptionalDefaultsRelations;

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> =
  UserOptionalDefaultsSchema.merge(
    z.object({
      avatar_image: z.lazy(() => FileOptionalDefaultsWithRelationsSchema).nullable(),
      session_list: z.lazy(() => SessionOptionalDefaultsWithRelationsSchema).array(),
      post_list: z.lazy(() => PostOptionalDefaultsWithRelationsSchema).array(),
      readingrecord_list: z.lazy(() => ReadingrecordOptionalDefaultsWithRelationsSchema).array(),
    }),
  );

export default UserSchema;
