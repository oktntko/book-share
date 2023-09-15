<script setup lang="ts">
import { useValidate } from '~/composables/useValidate';
import { type RouterOutput } from '~/lib/trpc';
import type { z } from '~/lib/zod';
import { trpc } from '~/middleware/trpc';
import ViewBook from '~/pages/components/ViewBook.vue';
import {
  BookRouterSchema,
  BookVolumeOrderBy,
  BookVolumeQueryfield,
} from '~/schema/BookRouterSchema';

const KEY_BOOK_SEARCH = 'KEY_BOOK_SEARCH';

withDefaults(defineProps<{ volume_id?: string }>(), { volume_id: '' });

defineEmits<{
  selected: [RouterOutput['book']['getVolume'], PointerEvent];
}>();

const modelValue = ref<z.infer<typeof BookRouterSchema.listInput>>({
  q: '',
  queryfield: '',
  offset: 0,
  limit: 30,
  orderBy: 'relevance',
  printType: 'all',
  projection: 'lite',
});
const { validateSubmit, ErrorMessage, revert } = useValidate(
  BookRouterSchema.listInput,
  modelValue,
);

const data = ref<RouterOutput['book']['listVolume']>({
  total: 0,
  volume_list: [],
});
const loading = ref(false);

const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.book.listVolume.query(modelValue.value);

    if (data.value.total) {
      saveSession();
    }
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  const json = restoreSession();
  if (json) {
    modelValue.value = JSON.parse(json);
  }

  if (modelValue.value.q) {
    handleSubmit();
  } else {
    data.value = { total: 0, volume_list: [] };
  }
});

function saveSession() {
  sessionStorage.setItem(KEY_BOOK_SEARCH, JSON.stringify(modelValue.value));
}
function clearSession() {
  sessionStorage.removeItem(KEY_BOOK_SEARCH);
}
function restoreSession() {
  return sessionStorage.getItem(KEY_BOOK_SEARCH);
}
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
          <!-- 一段目 -->
          <div class="flex items-start gap-4 laptop:items-center">
            <!-- フィルター -->
            <div class="flex shrink-0 items-start laptop:items-center">
              <Icon icon="bx:filter-alt" class="mr-2 h-5 w-5"></Icon>
              <div class="flex flex-col gap-0 laptop:flex-row laptop:gap-2">
                <label
                  v-for="[key, label] of Object.entries(BookVolumeQueryfield)"
                  :key="key"
                  :for="`queryfield-${key}`"
                  class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  <input
                    :id="`queryfield-${key}`"
                    v-model="modelValue.queryfield"
                    type="radio"
                    :value="key"
                    class="mr-1 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  {{ label }}
                </label>
                <ErrorMessage class="text-xs text-red-600" for="queryfield" />
              </div>
            </div>

            <!-- ソート -->
            <div class="flex shrink-0 items-start laptop:items-center">
              <Icon icon="bx:sort-down" class="mr-2 h-5 w-5"></Icon>
              <div class="flex flex-col gap-0 laptop:flex-row laptop:gap-2">
                <label
                  v-for="[key, label] of Object.entries(BookVolumeOrderBy)"
                  :key="key"
                  :for="`orderBy-${key}`"
                  class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  <input
                    :id="`orderBy-${key}`"
                    v-model="modelValue.orderBy"
                    type="radio"
                    :value="key"
                    class="mr-1 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  {{ label }}
                </label>
                <ErrorMessage class="text-xs text-red-600" for="orderBy" />
              </div>
            </div>
          </div>

          <!-- 二段目 -->
          <div>
            <label for="q" class="sr-only"> キーワード </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
              </div>
              <input
                id="q"
                v-model="modelValue.q"
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
          </div>
        </section>

        <section class="flex gap-4">
          <MyButton type="submit" classset="text" colorset="green">
            <Icon
              :horizontal-flip="true"
              inline
              icon="line-md:search-twotone"
              class="-ml-4 mr-2 h-4 w-4"
            ></Icon>
            検索
          </MyButton>

          <MyButton
            type="button"
            classset="text"
            colorset="white"
            @click="
              () => {
                revert();
                clearSession();
              }
            "
          >
            <Icon icon="bi:x" class="-ml-4 mr-2 h-4 w-4"></Icon>
            リセット
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
        <div v-else-if="data.total">
          <!-- startIndexを進めていくと、totalItems が大きくなるが items にデータが返却されない(undefinedになる)ので、配列の長さ判定する -->
          <div class="masonry-wrapper px-4">
            <a
              v-for="volume of data.volume_list"
              :key="volume.id!"
              class="masonry-item block cursor-pointer py-2"
              @click.stop="(e) => $emit('selected', volume, e)"
            >
              <ViewBook class="rounded" :volume="volume" :active="volume_id === volume.id">
              </ViewBook>
            </a>
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

<style>
/* https://twitter.com/pulpxstyle/status/1332510748690378758 */
/* PinterestレイアウトをCSSのみで実装 */
@media (min-width: 640px) {
  .masonry-wrapper {
    column-count: 1;
  }
}

@media (min-width: 768px) {
  .masonry-wrapper {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .masonry-wrapper {
    column-count: 3;
  }
}

.masonry-wrapper .masonry-item {
  break-inside: avoid;
}
</style>
