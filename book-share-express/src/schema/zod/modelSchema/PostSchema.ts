import { z } from '~/lib/zod';
import type { UserWithRelations } from './UserSchema';
import type { UserOptionalDefaultsWithRelations } from './UserSchema';
import { UserWithRelationsSchema } from './UserSchema';
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema';

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
  post_id: z.number().int(),
  /**
   * 投稿者ID
   */
  toukousya_id: z.number().int(),
  volume_id: z.string().trim().max(255),
  book_title: z.string().trim().max(400),
  post_title: z.string().trim().max(255),
  content: z.string().trim(),
  published: z.boolean(),
  published_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Post = z.infer<typeof PostSchema>;

/////////////////////////////////////////
// POST OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PostOptionalDefaultsSchema = PostSchema.merge(
  z.object({
    post_id: z.number().int().optional(),
    volume_id: z.string().trim().max(255).optional(),
    book_title: z.string().trim().max(400).optional(),
    post_title: z.string().trim().max(255).optional(),
    content: z.string().trim().optional(),
    published: z.boolean().optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  }),
);

export type PostOptionalDefaults = z.infer<typeof PostOptionalDefaultsSchema>;

/////////////////////////////////////////
// POST RELATION SCHEMA
/////////////////////////////////////////

export type PostRelations = {
  toukousya: UserWithRelations;
  hearted_list: UserWithRelations[];
  stocked_list: UserWithRelations[];
};

export type PostWithRelations = z.infer<typeof PostSchema> & PostRelations;

export const PostWithRelationsSchema: z.ZodType<PostWithRelations> = PostSchema.merge(
  z.object({
    toukousya: z.lazy(() => UserWithRelationsSchema),
    hearted_list: z.lazy(() => UserWithRelationsSchema).array(),
    stocked_list: z.lazy(() => UserWithRelationsSchema).array(),
  }),
);

/////////////////////////////////////////
// POST OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PostOptionalDefaultsRelations = {
  toukousya: UserOptionalDefaultsWithRelations;
  hearted_list: UserOptionalDefaultsWithRelations[];
  stocked_list: UserOptionalDefaultsWithRelations[];
};

export type PostOptionalDefaultsWithRelations = z.infer<typeof PostOptionalDefaultsSchema> &
  PostOptionalDefaultsRelations;

export const PostOptionalDefaultsWithRelationsSchema: z.ZodType<PostOptionalDefaultsWithRelations> =
  PostOptionalDefaultsSchema.merge(
    z.object({
      toukousya: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
      hearted_list: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
      stocked_list: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
    }),
  );

export default PostSchema;
