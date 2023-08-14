import { z } from '~/lib/zod';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import { PostScalarFieldEnumSchema } from '~/schema/zod/inputTypeSchemas/PostScalarFieldEnumSchema';
import { PostSchema } from '~/schema/zod/modelSchema/PostSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
  }),
  sort: z
    .object({
      field: PostScalarFieldEnumSchema,
      order: SortOrderSchema,
    })
    .array(),
  limit: z.number().max(100),
  offset: z.number(),
});

export const OutputPostSchema = PostSchema;

const listOutput = z.object({
  total: z.number(),
  post_list: z.array(OutputPostSchema),
});

const createInput = PostSchema.omit({
  post_id: true,
  toukousya_id: true,
  created_by: true,
  updated_by: true,
});

const getInput = PostSchema.pick({
  post_id: true,
});

const deleteInput = PostSchema.pick({
  post_id: true,
  updated_at: true,
});

const updateInput = createInput.merge(deleteInput);

export const PostRouterSchema = {
  listInput,
  listOutput,
  createInput,
  getInput,
  updateInput,
  deleteInput,
};
