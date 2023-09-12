import { z } from '~/lib/zod';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import { FileScalarFieldEnumSchema } from '~/schema/zod/inputTypeSchemas/FileScalarFieldEnumSchema';
import { FileSchema } from '~/schema/zod/modelSchema/FileSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
  }),
  sort: z
    .object({
      field: FileScalarFieldEnumSchema,
      order: SortOrderSchema,
    })
    .array(),
  limit: z.number().int().max(100),
  offset: z.number().int(),
});

const listOutput = z.object({
  total: z.number(),
  files: z.array(FileSchema),
});

const createInput = FileSchema.omit({
  file_id: true,
  created_at: true,
  created_by: true,
  updated_at: true,
  updated_by: true,
});

const getInput = FileSchema.pick({
  file_id: true,
});

const deleteInput = FileSchema.pick({
  file_id: true,
  updated_at: true,
});

const updateInput = createInput.merge(deleteInput);

export const FileRouterSchema = {
  listInput,
  listOutput,
  createInput,
  getInput,
  updateInput,
};
