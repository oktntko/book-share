import { UserSchema } from '~/schema/zod/modelSchema/UserSchema';

const createInput = UserSchema.pick({
  email: true,
});

export const AuthRouterSchema = {
  createInput,
};
