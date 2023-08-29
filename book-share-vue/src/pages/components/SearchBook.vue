<script setup lang="ts">
import { useValidate } from '~/composables/useValidate';
import { type RouterOutput } from '~/lib/trpc';
import type { z } from '~/lib/zod';
import { trpc } from '~/middleware/trpc';
import ViewBook from '~/pages/components/ViewBook.vue';
import { BookRouterSchema, BookVolumeQueryfield } from '~/schema/BookRouterSchema';

const KEY_BOOK_SEARCH = 'KEY_BOOK_SEARCH';

withDefaults(defineProps<{ volume_id?: string }>(), { volume_id: '' });

const emit = defineEmits<{
  success: [RouterOutput['book']['getVolume']];
  close: [];
}>();

const modelValue = ref<z.infer<typeof BookRouterSchema.listInput>>({
  q: '',
  queryfield: '',
  offset: 0,
  limit: 30,
  orderBy: 'relevance', // TODO
  printType: 'all', // TODO
  projection: 'lite', // TODO
});
// TODO
const { formId, validateSubmit } = useValidate(BookRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['book']['listVolume']>();
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
// TODO
function crearSession() {
  sessionStorage.removeItem(KEY_BOOK_SEARCH);
}
function restoreSession() {
  return sessionStorage.getItem(KEY_BOOK_SEARCH);
}
</script>

<template>
  <div v-if="data" class="flex !max-w-none flex-col gap-8 overflow-y-auto">
    <header>
      <form class="mb-4 flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- 一段目 -->
        <div class="flex justify-between">
          <!-- ラジオボタン -->
          <div class="flex gap-2">
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
                class="mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              {{ label }}
            </label>
            <MyErrorMessage class="text-xs text-red-600" :form-id="formId" name="queryfield" />
          </div>
        </div>
        <!-- 検索フォーム -->
        <div>
          <label
            for="default-search"
            class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Search
          </label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
            </div>
            <input
              id="default-search"
              v-model="modelValue.q"
              type="search"
              class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="検索ワード"
              required
            />
          </div>
        </div>
      </form>
    </header>

    <main class="relative shrink grow overflow-y-auto">
      <!-- 件数あり 検索結果 -->
      <div v-if="data.total">
        <!-- startIndexを進めていくと、totalItems が大きくなるが items にデータが返却されない(undefinedになる)ので、配列の長さ判定する -->
        <div class="masonry-wrapper px-4">
          <div
            v-for="volume of data.volume_list"
            :key="volume.id!"
            class="masonry-item cursor-pointer py-2"
            @click.stop="() => emit('success', volume)"
          >
            <ViewBook class="rounded" :volume="volume" :active="volume_id === volume.id">
            </ViewBook>
          </div>
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

      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-200"
        enter-to-class="transform opacity-100"
        leave-from-class="transform opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-to-class="transform opacity-0"
      >
        <MyPulseLoading v-show="loading" class="fixed inset-0 z-20 bg-gray-200/50"></MyPulseLoading>
      </Transition>
    </main>

    <footer>
      <VxePager
        class="!border-none !bg-transparent"
        background
        size="small"
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

  <!-- 初期表示 ローディング -->
  <div v-else class="flex !w-full !min-w-[unset] gap-8">
    <MyPulseLoading></MyPulseLoading>
    <div>
      <div class="flex items-center">
        <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
        <span class="sr-only">Info</span>
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
