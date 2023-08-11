import { z } from '~/lib/zod';

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

export default FileSchema;
