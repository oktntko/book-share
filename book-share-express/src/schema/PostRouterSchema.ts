import { z } from '~/lib/zod';
import { VolumeSchema } from '~/schema/BookRouterSchema';
import { SearchParamPostStatusEnum } from '~/schema/option/PostStatusSchema';
import { PostScalarFieldEnumSchema } from '~/schema/zod/inputTypeSchemas/PostScalarFieldEnumSchema';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import { PostSchema } from '~/schema/zod/modelSchema/PostSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
    postStatus: SearchParamPostStatusEnum.or(z.literal('')).default(''),
  }),
  sort: z.record(PostScalarFieldEnumSchema, SortOrderSchema),
  limit: z.number().int().max(100),
  offset: z.number().int(),
});

export const PostSchemaOutput = PostSchema.merge(
  z.object({
    volume: VolumeSchema.optional(),
  }),
);

const listOutput = z.object({
  total: z.number(),
  post_list: z.array(PostSchemaOutput),
});

const createInput = PostSchema.omit({
  post_id: true,
  toukousya_id: true,
  hearts: true,
  published: true,
  published_at: true,
  created_at: true,
  updated_at: true,
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
