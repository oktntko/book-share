import { z } from '~/lib/zod';
import { UserSchema } from '~/schema/zod/modelSchema/UserSchema';

const signupInput = UserSchema.pick({
  email: true,
})
  .merge(
    z.object({
      password: z.string().trim().min(8).max(255),
      confirm: z.string().trim().min(1).max(255),
    }),
  )
  .refine((data) => data.password === data.confirm, {
    message: 'パスワードが一致していません。',
    path: ['confirm'],
  });

const signinInput = UserSchema.pick({
  email: true,
  password: true,
});

export const AuthRouterSchema = {
  signupInput,
  signinInput,
};
