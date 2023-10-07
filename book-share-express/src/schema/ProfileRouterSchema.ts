import { z } from '~/lib/zod';
import { UserSchema } from '~/schema/zod/modelSchema/UserSchema';

export const OutputProfileSchema = UserSchema.pick({
  username: true,
  email: true,
  avatar_file_id: true,
  twofa_enable: true,
});

const patchProfileInput = UserSchema.pick({
  username: true,
  email: true,
  avatar_file_id: true,
});

const patchPasswordInput = z
  .object({
    current_password: z.string().trim().min(8).max(255),
    new_password: z.string().trim().min(8).max(255),
    confirm: z.string().trim().min(1).max(255),
  })
  .refine((data) => data.new_password === data.confirm, {
    message: 'パスワードが一致していません。',
    path: ['confirm'],
  });

const enableSecretInput = z.object({
  token: z.string().length(6),
});

export const ProfileRouterSchema = {
  patchProfileInput,
  patchPasswordInput,
  enableSecretInput,
};
