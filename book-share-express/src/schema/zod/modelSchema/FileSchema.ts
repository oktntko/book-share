import { z } from '~/lib/zod';
import type { UserWithRelations } from './UserSchema';
import type { UserOptionalDefaultsWithRelations } from './UserSchema';
import { UserWithRelationsSchema } from './UserSchema';
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema';

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  file_id: z.string().uuid(),
  originalname: z.string().trim().min(1).max(255),
  mimetype: z.string().trim().min(1).max(100),
  size: z.number().int(),
  created_at: z.coerce.date(),
  created_by: z.number().int(),
  updated_at: z.coerce.date(),
  updated_by: z.number().int(),
});

export type File = z.infer<typeof FileSchema>;

/////////////////////////////////////////
// FILE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const FileOptionalDefaultsSchema = FileSchema.merge(
  z.object({
    file_id: z.string().uuid().optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
);

export type FileOptionalDefaults = z.infer<typeof FileOptionalDefaultsSchema>;

/////////////////////////////////////////
// FILE RELATION SCHEMA
/////////////////////////////////////////

export type FileRelations = {
  user_list: UserWithRelations[];
};

export type FileWithRelations = z.infer<typeof FileSchema> & FileRelations;

export const FileWithRelationsSchema: z.ZodType<FileWithRelations> = FileSchema.merge(
  z.object({
    user_list: z.lazy(() => UserWithRelationsSchema).array(),
  }),
);

/////////////////////////////////////////
// FILE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type FileOptionalDefaultsRelations = {
  user_list: UserOptionalDefaultsWithRelations[];
};

export type FileOptionalDefaultsWithRelations = z.infer<typeof FileOptionalDefaultsSchema> &
  FileOptionalDefaultsRelations;

export const FileOptionalDefaultsWithRelationsSchema: z.ZodType<FileOptionalDefaultsWithRelations> =
  FileOptionalDefaultsSchema.merge(
    z.object({
      user_list: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
    }),
  );

export default FileSchema;
