<script setup lang="ts">
import {
  BookRouterSchema,
  BookVolumeOrderBy,
  BookVolumeQueryfield,
} from '@book-share/express/schema';
import type { z } from '@book-share/lib/zod';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import { trpc, type RouterOutput } from '~/lib/trpc';
import ViewBook from '~/page/component/ViewBook.vue';

withDefaults(defineProps<{ volume_id?: string }>(), { volume_id: '' });

defineEmits<{
  selected: [RouterOutput['book']['getVolume'], MouseEvent];
}>();

const modelValue = ref<Required<z.infer<typeof BookRouterSchema.listInput>>>({
  q: '',
  queryfield: '',
  page: 1,
  limit: 30,
  orderBy: 'relevance',
  printType: 'all',
  projection: 'lite',
});
const { validateSubmit, revert } = useVueValidateZod(BookRouterSchema.listInput, modelValue);

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

const KEY_BOOK_SEARCH = 'KEY_BOOK_SEARCH';

function saveSession() {
  sessionStorage.setItem(KEY_BOOK_SEARCH, JSON.stringify(modelValue.value));
}
function clearSession() {
  sessionStorage.removeItem(KEY_BOOK_SEARCH);
}
function restoreSession() {
  return sessionStorage.getItem(KEY_BOOK_SEARCH);
}

const showMenu = ref(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <header>
      <form
        class="flex flex-col gap-4"
        @submit.prevent="
          () => {
            modelValue.page = 1;
            return handleSubmit();
          }
        "
      >
        <div class="flex">
          <div class="relative shrink-0">
            <OnClickOutside @trigger="() => (showMenu = false)">
              <button
                class="inline-flex w-32 items-center rounded-s-lg border border-gray-300 bg-white p-2 text-center text-sm text-gray-900 transition-all"
                :class="['hover:bg-gray-200 focus:ring focus:ring-gray-300 focus:outline-none']"
                type="button"
                @click="showMenu = !showMenu"
              >
                <span class="icon-[bx--filter-alt] mr-2 h-5 w-5"></span>
                <span class="grow text-left">
                  {{ BookVolumeQueryfield[modelValue.queryfield] }}
                </span>
                <span class="icon-[mingcute--down-fill] -mr-1 ml-2 h-5 w-5"></span>
              </button>
            </OnClickOutside>
            <Transition
              enter-from-class="opacity-0 -translate-y-2"
              enter-active-class="transition ease-out duration-150"
              enter-to-class="opacity-100 translate-y-0"
              leave-from-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div
                v-show="showMenu"
                class="absolute left-0 z-50 w-full divide-y divide-gray-100 rounded-lg border border-gray-300 bg-white shadow-lg"
                :class="['min-w-max whitespace-nowrap']"
                role="menu"
                aria-orientation="vertical"
                tabindex="-1"
              >
                <ul class="text-sm text-gray-900">
                  <li
                    v-for="[key, label] of Object.entries(BookVolumeQueryfield)"
                    :key="key"
                    class="first:rounded-t-lg last:rounded-b-lg"
                    :class="[
                      'transition-colors hover:bg-blue-100',
                      { 'bg-blue-100': modelValue.queryfield === key },
                    ]"
                  >
                    <label
                      :for="`queryfield-${key}`"
                      class="inline-flex w-full cursor-pointer items-center px-2.5 py-2.5 text-sm font-medium text-gray-900"
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
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
          <div class="relative grow">
            <input
              id="q"
              v-model="modelValue.q"
              type="search"
              class="block w-full border border-s-0 border-e-0 border-gray-300 bg-white p-2 text-sm text-gray-900 transition-all"
              :class="['focus:ring focus:ring-gray-300 focus:outline-none']"
              required
              autofocus
              @search="
                () => {
                  // イベントが発生するのは、①Enter によって検索を実行したとき or ②xボタンをクリックしたとき
                  if (!modelValue.q) {
                    revert();
                    clearSession();
                  }
                }
              "
            />
          </div>
          <div class="relative shrink-0">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-e-lg border px-4 py-2 text-sm transition-all focus:ring focus:outline-none"
              :class="['border-blue-700 bg-white text-blue-700 hover:bg-blue-800 hover:text-white']"
            >
              <span class="icon-[line-md--search-twotone] mr-2 -ml-2 h-5 w-5"></span>
              検索
            </button>
          </div>
        </div>

        <!-- ソート -->
        <div class="flex shrink-0 items-center">
          <span class="icon-[bx--sort-down] mr-2 h-5 w-5"></span>
          <div class="flex flex-row gap-2">
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
                @change="handleSubmit"
              />
              {{ label }}
            </label>
          </div>
        </div>
      </form>
    </header>

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
      <div v-if="loading" class="flex grow justify-center gap-8">
        <MyLoading></MyLoading>
      </div>

      <!-- 件数あり 検索結果 -->
      <div v-else-if="data.total">
        <!-- startIndexを進めていくと、totalItems が大きくなるが items にデータが返却されない(undefinedになる)ので、配列の長さ判定する -->
        <div class="masonry-wrapper">
          <div v-for="volume of data.volume_list" :key="volume.id!" class="masonry-item py-2">
            <a class="block cursor-pointer" @click.stop="(e) => $emit('selected', volume, e)">
              <ViewBook class="rounded" :volume="volume" :active="volume_id === volume.id">
              </ViewBook>
            </a>
          </div>
        </div>

        <MyPaginator
          v-if="data.volume_list.length"
          :currentPage="modelValue.page"
          :limit="modelValue.limit"
          :total="data.total"
          @click="
            (page) => {
              modelValue.page = page;
              handleSubmit();
            }
          "
        >
        </MyPaginator>
      </div>

      <!-- 件数なし 該当なしメッセージ -->
      <div
        v-else
        class="mb-4 border-t-2 border-yellow-300 bg-yellow-50 p-4 dark:bg-yellow-200"
        role="alert"
      >
        <div class="flex items-center">
          <span class="icon-[akar-icons--info-fill] mr-2 h-5 w-5 text-yellow-700"></span>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-yellow-700 dark:text-yellow-800">
            一致する書籍が見つかりませんでした。
          </h3>
        </div>
        <ul class="mt-4 mb-2 text-sm text-yellow-700 dark:text-yellow-800">
          <li>キーワードに誤字・脱字がないか確認します。</li>
          <li>別のキーワードを試してみます。</li>
          <li>もっと一般的なキーワードに変えてみます。</li>
          <li>キーワードの数を減らしてみます。</li>
        </ul>
      </div>
    </Transition>
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
