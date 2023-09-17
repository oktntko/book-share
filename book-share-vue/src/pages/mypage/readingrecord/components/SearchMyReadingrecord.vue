<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import ModalEditReadingrecord from '~/pages/mypage/readingrecord/components/ModalEditReadingrecord.vue';
import ViewBookReadingrecord from '~/pages/mypage/readingrecord/components/ViewBookReadingrecord.vue';
import { ReadingrecordRouterSchema } from '~/schema/ReadingrecordRouterSchema';
import { openLoading, openSuccessToast } from '~/utils/ProgrammaticComponentHelper';

const modelValue = ref<z.infer<typeof ReadingrecordRouterSchema.listInput>>({
  where: {
    keyword: '',
  },
  sort: { created_at: 'desc' },
  limit: 30,
  offset: 0,
});

const { validateSubmit, ErrorMessage } = useValidate(
  ReadingrecordRouterSchema.listInput,
  modelValue,
);

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
            <ErrorMessage for="where.keyword" class="text-xs text-red-600" />
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

    <main class="shrink grow overflow-y-auto">
      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-200"
        enter-to-class="transform opacity-100"
        leave-from-class="transform opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-to-class="transform opacity-0"
      >
        <!-- 初期表示 ローディング -->
        <div v-if="loading" class="flex justify-center gap-8">
          <MyPulseLoading></MyPulseLoading>
          <div>
            <div class="flex items-center">
              <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
              <h3 class="text-lg font-medium text-blue-900">検索のコツ</h3>
            </div>
            <ul class="mb-2 mt-4 text-sm text-blue-700 dark:text-blue-800">
              <li>ヒント 1. まずはシンプルに</li>
              <li>ヒント 2. 音声で検索する</li>
              <li>ヒント 3. 検索語句を工夫する</li>
              <li>ヒント 4. 間違えてもだいじょうぶ</li>
              <li>ヒント 5. 便利な機能を利用する</li>
            </ul>
          </div>
        </div>

        <!-- 件数あり 検索結果 -->
        <div v-else-if="data.total" class="flex flex-wrap gap-4 px-2">
          <!-- startIndexを進めていくと、totalItems が大きくなるが items にデータが返却されない(undefinedになる)ので、配列の長さ判定する -->
          <div
            v-for="(readingrecord, i) of data.readingrecord_list"
            :key="readingrecord.readingrecord_id"
          >
            <ViewBookReadingrecord
              class="w-72 rounded"
              :readingrecord="data.readingrecord_list[i]"
              @update="
                async () => {
                  const result = await $modal.open<
                    RouterOutput['readingrecord']['update'] | undefined
                  >({
                    component: ModalEditReadingrecord,
                    componentProps: {
                      readingrecord_id: readingrecord.readingrecord_id,
                    },
                    componentEvents: {},
                  });

                  if (result) {
                    data.readingrecord_list[i] = result;
                  }
                }
              "
              @delete="
                async () => {
                  if (await $dialog.confirm('データを削除しますか？\nこの操作は取り消せません。')) {
                    const loading = openLoading();
                    try {
                      await trpc.readingrecord.delete.mutate(readingrecord);

                      data.readingrecord_list = data.readingrecord_list.filter(
                        (inlist) => inlist.readingrecord_id !== readingrecord.readingrecord_id,
                      );

                      openSuccessToast('データを削除しました。');
                    } finally {
                      loading.close();
                    }
                  }
                }
              "
              @post="
                $router.push({
                  path: '/mypage/post/add',
                  query: { volume_id: readingrecord.volume_id },
                })
              "
            >
            </ViewBookReadingrecord>
          </div>
        </div>

        <!-- 件数なし 該当なしメッセージ -->
        <div
          v-else
          class="mb-4 border-t-2 border-yellow-300 bg-yellow-50 p-4 dark:bg-yellow-200"
          role="alert"
        >
          <div class="flex items-center">
            <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-yellow-700"></Icon>
            <span class="sr-only">Info</span>
            <h3 class="text-lg font-medium text-yellow-700 dark:text-yellow-800">
              一致する書籍が見つかりませんでした。
            </h3>
          </div>
          <ul class="mb-2 mt-4 text-sm text-yellow-700 dark:text-yellow-800">
            <li>キーワードに誤字・脱字がないか確認します。</li>
            <li>別のキーワードを試してみます。</li>
            <li>もっと一般的なキーワードに変えてみます。</li>
            <li>キーワードの数を減らしてみます。</li>
          </ul>
        </div>
      </Transition>
    </main>

    <footer>
      <VxePager
        class="!border-none !bg-transparent"
        background
        size="small"
        :loading="loading"
        :current-page="modelValue.offset / modelValue.limit + 1"
        :page-size="modelValue.limit"
        :total="data.total"
        :page-sizes="[10, 20, 30, 40]"
        perfect
        @page-change="
          ({ pageSize, currentPage }) => {
            modelValue.limit = pageSize;
            modelValue.offset = (currentPage - 1) * pageSize;

            handleSubmit();
          }
        "
      ></VxePager>
    </footer>
  </div>
</template>
