import { z } from '~/lib/zod';

export const OkSchema = z.object({ ok: z.literal(true) });
