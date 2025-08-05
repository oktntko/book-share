import { z } from '~/lib/zod';

export const UserScalarFieldEnumSchema = z.enum([
  'user_id',
  'avatar_file_id',
  'email',
  'password',
  'username',
  'twofa_enable',
  'twofa_secret',
  'created_at',
  'created_by',
  'updated_at',
  'updated_by',
]);

export default UserScalarFieldEnumSchema;
