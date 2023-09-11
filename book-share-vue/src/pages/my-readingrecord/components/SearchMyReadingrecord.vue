<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import { ReadingrecordRouterSchema } from '~/schema/ReadingrecordRouterSchema';

const modelValue = ref<z.infer<typeof ReadingrecordRouterSchema.listInput>>({
  where: {
    keyword: '',
  },
  sort: { created_at: 'desc' },
  limit: 30,
  offset: 0,
});

const { formId, validateSubmit } = useValidate(ReadingrecordRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['readingrecord']['list']>({
  total: 0,
  readingrecord_list: [],
});
const loading = ref(false);
const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.readingrecord.list.query(modelValue.value);
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
      <form
        class="flex flex-col gap-4"
        @submit.prevent="
          () => {
            modelValue.offset = 0;
            handleSubmit();
          }
        "
      >
        <section class="flex flex-col gap-2">
          <div>
            <label for="where.keyword" class="sr-only"> キーワード </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
              </div>
              <input
                id="where.keyword"
                v-model.lazy="modelValue.where.keyword"
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                maxlength="255"
              />
            </div>
            <MyErrorMessage name="where.keyword" class="text-xs text-red-600" :form-id="formId" />
          </div>
        </section>

        <section>
          <MyButton type="submit" classset="text" colorset="green">
            <Icon
              :horizontal-flip="true"
              inline
              icon="line-md:search-twotone"
              class="-ml-4 mr-2 h-4 w-4"
            ></Icon>
            検索
          </MyButton>
        </section>
      </form>
    </header>

    <main class="shrink grow overflow-y-auto"></main>

    <footer></footer>
  </div>
</template>
