import { z } from '~/lib/zod';
import { VolumeSchema } from '~/schema/BookRouterSchema';
import { SearchParamPostStatusEnum } from '~/schema/option/PostStatusSchema';
import { PostScalarFieldEnumSchema, PostSchema, SortOrderSchema, UserSchema } from '~/schema/zod';

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

export const PublicPostSchemaOutput = PostSchema.merge(
  z.object({
    toukousya: UserSchema.pick({
      username: true,
      avatar_file_id: true,
      description: true,
    }),
    volume: VolumeSchema.optional(),
    related_post_list: PostSchemaOutput.array(),
  }),
);

const listOutput = z.object({
  total: z.number(),
  post_list: z.array(PostSchemaOutput),
});

const createInput = PostSchema.omit({
  post_id: true,
  toukousya_id: true,
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

const publishInput = deleteInput.merge(
  PostSchema.pick({
    published: true,
  }),
);

export const PostRouterSchema = {
  listInput,
  listOutput,
  createInput,
  getInput,
  updateInput,
  deleteInput,
  publishInput,
};
