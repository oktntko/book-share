import { z } from '@book-share/lib/zod';
import {
  PostScalarFieldEnumSchema,
  PostSchema,
  SearchParamPostStatusEnum,
  SortOrderSchema,
} from '@book-share/prisma/schema';
import { VolumeSchema } from './BookRouterSchema';
import { ProfileRouterSchema } from './ProfileRouterSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
    postStatus: SearchParamPostStatusEnum.or(z.literal('')).default(''),
  }),
  sort: z.object({
    field: PostScalarFieldEnumSchema,
    order: SortOrderSchema,
  }),
  limit: z.number().int().max(100),
  page: z.number().int(),
});

export const PostSchemaOutput = PostSchema.merge(
  z.object({
    toukousya: ProfileRouterSchema.patchProfileInput,
    volume: VolumeSchema.optional(),
  }),
);

export const PublicPostSchemaOutput = PostSchemaOutput.merge(
  z.object({
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
