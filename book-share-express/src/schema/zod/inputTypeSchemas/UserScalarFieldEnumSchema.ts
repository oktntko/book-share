import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['user_id','email','username','created_at','created_by','updated_at','updated_by']);

export default UserScalarFieldEnumSchema;
