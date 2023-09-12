import { z } from '~/lib/zod';
import { VolumeSchema } from '~/schema/BookRouterSchema';
import { ReadingrecordScalarFieldEnumSchema } from '~/schema/zod/inputTypeSchemas/ReadingrecordScalarFieldEnumSchema';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import { ReadingrecordSchema } from '~/schema/zod/modelSchema/ReadingrecordSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
  }),
  sort: z.record(ReadingrecordScalarFieldEnumSchema, SortOrderSchema),
  limit: z.number().int().max(100),
  offset: z.number().int(),
});

export const ReadingrecordSchemaOutput = ReadingrecordSchema.merge(
  z.object({
    volume: VolumeSchema.optional(),
  }),
);

const listOutput = z.object({
  total: z.number(),
  readingrecord_list: z.array(ReadingrecordSchemaOutput),
});

const createInput = ReadingrecordSchema.omit({
  readingrecord_id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

const getInput = ReadingrecordSchema.pick({
  readingrecord_id: true,
});

const deleteInput = ReadingrecordSchema.pick({
  readingrecord_id: true,
  updated_at: true,
});

const updateInput = createInput.merge(deleteInput);

export const ReadingrecordRouterSchema = {
  listInput,
  listOutput,
  createInput,
  getInput,
  updateInput,
  deleteInput,
};
