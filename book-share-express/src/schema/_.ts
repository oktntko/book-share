import dayjs from 'dayjs';
import { z } from '~/lib/zod';

export const CoerceDateSchema = z
  .string()
  .pipe(z.coerce.date())
  .transform((data) => dayjs(data).format('YYYY-MM-DD'));
