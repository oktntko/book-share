import dayjs from 'dayjs';
import { z } from '~/lib/zod';

export const OkSchema = z.object({ ok: z.literal(true) });

export const CoerceDateSchema = z
  .string()
  .pipe(z.coerce.date())
  .transform((data) => dayjs(data).format('YYYY-MM-DD'));
