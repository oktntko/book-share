import { z } from '~/lib/zod';

export const ReadingrecordScalarFieldEnumSchema = z.enum([
  'readingrecord_id',
  'user_id',
  'volume_id',
  'book_title',
  'read_at',
  'star',
  'hitokoto',
  'created_at',
  'updated_at',
]);

export default ReadingrecordScalarFieldEnumSchema;
