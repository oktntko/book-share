import { z } from '~/lib/zod';
import type { UserWithRelations } from './UserSchema';
import type { UserOptionalDefaultsWithRelations } from './UserSchema';
import { UserWithRelationsSchema } from './UserSchema';
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema';

/////////////////////////////////////////
// READINGRECORD SCHEMA
/////////////////////////////////////////

export const ReadingrecordSchema = z.object({
  readingrecord_id: z.number().int(),
  /**
   * 本を読んだ人のユーザID
   */
  user_id: z.number().int(),
  volume_id: z.string().trim().max(255),
  book_title: z.string().trim().max(400),
  read_at: z.coerce.date(),
  star: z.number().int(),
  hitokoto: z.string().trim().max(255),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Readingrecord = z.infer<typeof ReadingrecordSchema>;

/////////////////////////////////////////
// READINGRECORD OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ReadingrecordOptionalDefaultsSchema = ReadingrecordSchema.merge(
  z.object({
    readingrecord_id: z.number().int().optional(),
    volume_id: z.string().trim().max(255).optional(),
    book_title: z.string().trim().max(400).optional(),
    star: z.number().int().optional(),
    hitokoto: z.string().trim().max(255).optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
);

export type ReadingrecordOptionalDefaults = z.infer<typeof ReadingrecordOptionalDefaultsSchema>;

/////////////////////////////////////////
// READINGRECORD RELATION SCHEMA
/////////////////////////////////////////

export type ReadingrecordRelations = {
  user: UserWithRelations;
};

export type ReadingrecordWithRelations = z.infer<typeof ReadingrecordSchema> &
  ReadingrecordRelations;

export const ReadingrecordWithRelationsSchema: z.ZodType<ReadingrecordWithRelations> =
  ReadingrecordSchema.merge(
    z.object({
      user: z.lazy(() => UserWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// READINGRECORD OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ReadingrecordOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type ReadingrecordOptionalDefaultsWithRelations = z.infer<
  typeof ReadingrecordOptionalDefaultsSchema
> &
  ReadingrecordOptionalDefaultsRelations;

export const ReadingrecordOptionalDefaultsWithRelationsSchema: z.ZodType<ReadingrecordOptionalDefaultsWithRelations> =
  ReadingrecordOptionalDefaultsSchema.merge(
    z.object({
      user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    }),
  );

export default ReadingrecordSchema;
