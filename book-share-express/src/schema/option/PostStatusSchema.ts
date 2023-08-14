import { z } from '~/lib/zod';

// 検索条件
export const SearchParamPostStatusList = ['下書き', '公開中', 'すべて'] as const;
export const SearchParamPostStatusEnum = z.enum(SearchParamPostStatusList);
