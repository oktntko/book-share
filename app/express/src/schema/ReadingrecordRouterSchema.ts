import { z } from '@book-share/lib/zod';
import {
  ReadingrecordScalarFieldEnumSchema,
  ReadingrecordSchema,
  SortOrderSchema,
} from '@book-share/prisma/schema';
import { VolumeSchema } from './BookRouterSchema';

const listInput = z.object({
  where: z.object({
    keyword: z.string().trim().max(255),
  }),
  sort: z.object({
    field: ReadingrecordScalarFieldEnumSchema,
    order: SortOrderSchema,
  }),
  limit: z.number().int().max(100),
  page: z.number().int(),
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
