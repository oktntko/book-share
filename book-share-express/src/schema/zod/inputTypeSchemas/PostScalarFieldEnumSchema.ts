import { z } from '~/lib/zod';

export const PostScalarFieldEnumSchema = z.enum([
  'post_id',
  'toukousya_id',
  'book_id',
  'book_title',
  'post_title',
  'content',
  'published',
  'published_at',
  'hearts',
  'created_at',
  'updated_at',
]);

export default PostScalarFieldEnumSchema;
