import { z } from '@book-share/lib/zod';

// 検索条件
export const SearchParamPostSpanList = ['週間', '月間', '累計'] as const;
export const SearchParamPostSpanEnum = z.enum(SearchParamPostSpanList);
