<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import { UserRouterSchema } from '~/schema/UserRouterSchema';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import UserScalarFieldEnumSchema from '~/schema/zod/inputTypeSchemas/UserScalarFieldEnumSchema';

const modelValue = ref<z.infer<typeof UserRouterSchema.listInput>>({
  where: {
    keyword: '',
  },
  sort: [],
  limit: 30,
  offset: 0,
});

const { formId, validateSubmit } = useValidate<typeof UserRouterSchema.listInput.shape>(
  UserRouterSchema.listInput,
  modelValue,
);

const data = ref<RouterOutput['user']['list']>({
  total: 0,
  user_list: [],
});
const loading = ref(false);
const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.user.list.query(modelValue.value);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  handleSubmit();
});
</script>

<template>
  <div class="flex flex-col gap-8 overflow-y-auto">
    <header>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <section class="flex flex-col gap-2">
          <div class="flex flex-col gap-1">
            <label for="keyword" class="text-sm font-medium text-gray-900"> キーワード </label>
            <input
              id="keyword"
              v-model.lazy="modelValue.where.keyword"
              name="keyword"
              type="search"
              class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            />
            <MyErrorMessage class="text-xs text-red-600" :form-id="formId" name="keyword" />
          </div>
        </section>

        <section>
          <MyButton type="submit" classset="text" colorset="green">
            <Icon icon="line-md:search-filled" class="mr-2 h-4 w-4"></Icon>
            検索
          </MyButton>
        </section>
      </form>
    </header>

    <main class="shrink grow overflow-y-auto">
      <VxeToolbar perfect>
        <template #buttons>
          <div class="ml-4 flex gap-2">
            <RouterLink to="/system/user/add">
              <MyButton classset="text" colorset="blue" secondary>ユーザを追加する</MyButton>
            </RouterLink>
          </div>
        </template>
      </VxeToolbar>

      <VxeTable
        :data="data.user_list"
        border
        :loading="loading"
        show-overflow
        show-header-overflow
        :column-config="{ resizable: true }"
        :row-config="{ isCurrent: true, isHover: true }"
        :sort-config="{
          defaultSort: modelValue.sort,
          multiple: true,
          remote: true,
          trigger: 'cell',
        }"
        @sort-change="
          ({ sortList }) => {
            modelValue.sort = sortList.map((sort) => {
              return {
                field: sort.field as z.infer<typeof UserScalarFieldEnumSchema>,
                order: sort.order as z.infer<typeof SortOrderSchema>,
              };
            });

            handleSubmit();
          }
        "
      >
        <VxeColumn type="seq" width="48" align="right"></VxeColumn>
        <VxeColumn field="username" title="名前" sortable>
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <MyImage
                :src-base="
                  row.avatar_file_id
                    ? `api/file/download/${row.avatar_file_id}`
                    : `https://dummyimage.com/256x256`
                "
                width="32"
                height="32"
                decoding="async"
                class="h-8 w-8 rounded-full object-cover object-center"
                alt="avatar"
              />
              <RouterLink
                :to="`/system/user/${row.user_id}`"
                class="text-blue-600 hover:text-blue-900"
              >
                {{ row.username }}
              </RouterLink>
            </div>
          </template>
        </VxeColumn>
        <VxeColumn field="email" title="メールアドレス" sortable></VxeColumn>
      </VxeTable>

      <VxePager
        :loading="loading"
        :current-page="modelValue.offset / modelValue.limit + 1"
        :page-size="modelValue.limit"
        :total="data.total"
        :page-sizes="[30, 50, 100]"
        perfect
        @page-change="
          ({ pageSize, currentPage }) => {
            modelValue.limit = pageSize;
            modelValue.offset = (currentPage - 1) * pageSize;

            handleSubmit();
          }
        "
      >
      </VxePager>
    </main>

    <footer></footer>
  </div>
</template>
