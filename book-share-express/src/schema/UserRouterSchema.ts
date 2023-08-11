import { z } from '~/lib/zod';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import { UserScalarFieldEnumSchema } from '~/schema/zod/inputTypeSchemas/UserScalarFieldEnumSchema';
import { UserSchema } from '~/schema/zod/modelSchema/UserSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
  }),
  sort: z
    .object({
      field: UserScalarFieldEnumSchema.or(
        z.enum(['syokusyu.syokusyu_name', 'toukyuu.toukyuu_name']),
      ),
      order: SortOrderSchema,
    })
    .array(),
  limit: z.number().max(100),
  offset: z.number(),
});

export const OutputUserSchema = UserSchema;

const listOutput = z.object({
  total: z.number(),
  user_list: z.array(OutputUserSchema),
});

const createInput = UserSchema.omit({
  user_id: true,
  created_at: true,
  created_by: true,
  updated_at: true,
  updated_by: true,
});

const getInput = UserSchema.pick({
  user_id: true,
});

const deleteInput = UserSchema.pick({
  user_id: true,
  updated_at: true,
});

const updateInput = createInput.merge(deleteInput);

export const UserRouterSchema = {
  listInput,
  listOutput,
  createInput,
  getInput,
  updateInput,
  deleteInput,
};
