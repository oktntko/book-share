import { z } from '~/lib/zod';

export const UserScalarFieldEnumSchema = z.enum([
  'user_id',
  'avatar_file_id',
  'email',
  'username',
  'created_at',
  'created_by',
  'updated_at',
  'updated_by',
]);

export default UserScalarFieldEnumSchema;
