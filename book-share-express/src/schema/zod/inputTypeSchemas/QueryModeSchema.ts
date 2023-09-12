import { z } from '~/lib/zod';

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export default QueryModeSchema;
