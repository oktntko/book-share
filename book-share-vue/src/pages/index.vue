<script setup lang="ts">
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import type { z } from '~/lib/zod';
import { trpc } from '~/middleware/trpc';
import { PostRouterSchema } from '~/schema/PostRouterSchema';
import {
  SearchParamPostSpanList,
  type SearchParamPostSpanEnum,
} from '~/schema/option/PostSpanSchema';

const modelValue = ref<z.infer<typeof PostRouterSchema.listInput>>({
  where: {
    keyword: '',
    postStatus: 'すべて',
  },
  sort: { created_at: 'desc' },
  limit: 30,
  offset: 0,
});

const { validateSubmit } = useValidate(PostRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['post']['list']>({
  total: 0,
  post_list: [],
});

const loading = ref(true);

const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.post.list.query(modelValue.value);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  handleSubmit();
});

const span = ref<z.infer<typeof SearchParamPostSpanEnum>>('累計');
const ranking = ref<RouterOutput['book']['ranking']>({
  volume_list: [],
});
const loadingRanking = ref(true);
watch(
  span,
  async () => {
    loadingRanking.value = true;
    try {
      ranking.value = await trpc.book.ranking.query({ span: span.value });
    } finally {
      loadingRanking.value = false;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="container mx-auto mb-8 flex gap-8 p-4">
    <div class="w-80 shrink-0 py-4">
      <header class="flex items-center justify-between">
        <p>今、読まれています</p>
        <div class="flex justify-end gap-2 text-xs">
          <a
            v-for="postSpan of SearchParamPostSpanList"
            :key="postSpan"
            class="cursor-pointer text-blue-900 transition-colors hover:text-blue-500 hover:underline"
            :class="{ 'font-bold': span === postSpan }"
            @click="span = postSpan"
          >
            {{ postSpan }}
          </a>
        </div>
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
        <MyPulseLoading v-if="loadingRanking" class="py-4"></MyPulseLoading>
        <div v-else class="flex flex-col gap-2 py-4">
          <div
            v-for="(volume, i) of ranking.volume_list"
            :key="volume.id!!"
            class="rounded border bg-white p-4"
          >
            <div class="flex gap-4">
              <!-- ランキング -->
              <div class="flex flex-col items-center">
                <span>{{ i + 1 }}</span>
              </div>
              <!-- サムネイル -->
              <div class="flex shrink-0 flex-col">
                <div class="relative mx-auto inline">
                  <img
                    :title="volume.volumeInfo?.title ?? ''"
                    :alt="volume.volumeInfo?.title ?? ''"
                    class="relative z-10 h-[94px] w-[64px] rounded object-cover object-center"
                    :src="
                      volume.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/64x94'
                    "
                    height="94"
                    width="64"
                    decoding="async"
                  />
                  <img
                    :title="volume.volumeInfo?.title ?? ''"
                    :alt="volume.volumeInfo?.title ?? ''"
                    class="absolute -bottom-1 left-1 z-[9] h-[94px] w-[64px] object-cover object-center opacity-80 blur"
                    :src="
                      volume.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/64x94'
                    "
                    height="94"
                    width="64"
                    decoding="async"
                  />
                </div>
              </div>
              <!-- 右側 -->
              <div v-if="volume.volumeInfo" class="flex flex-col gap-1 text-gray-900">
                <h3
                  v-if="volume.volumeInfo?.authors"
                  class="text-xs text-blue-500 transition-colors"
                >
                  {{ volume.volumeInfo?.authors.join(', ') }}
                </h3>
                <h2
                  v-if="volume.volumeInfo?.title"
                  class="line-clamp line-clamp-2 text-lg font-bold"
                >
                  {{ volume.volumeInfo?.title }}
                </h2>
                <h2 v-if="volume.volumeInfo?.subtitle" class="text-sm text-gray-600">
                  {{ volume.volumeInfo?.subtitle }}
                </h2>
                <span v-if="volume.volumeInfo?.publishedDate" class="text-xs text-gray-600">
                  {{ volume.volumeInfo?.publishedDate }}
                </span>
                <span v-if="volume.volumeInfo?.publisher" class="text-xs text-gray-600">
                  {{ volume.volumeInfo?.publisher }}
                </span>
              </div>
            </div>
            <div class="mt-1 truncate text-right font-bold text-blue-600">
              {{ volume.count.toLocaleString() }}
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div class="flex grow flex-col justify-start gap-4">
      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-100"
        enter-to-class="transform opacity-100"
        leave-from-class="transform opacity-100"
        leave-active-class="transition ease-in duration-100"
        leave-to-class="transform opacity-0"
      >
        <!-- スケルトン -->
        <div v-if="loading">
          <div class="flex flex-col gap-4">
            <!-- 投稿のタイトルリスト -->
            <a
              v-for="post of ['1', '2', '3', '4', '5']"
              :key="post"
              class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-blue-100"
            >
              <!-- サムネイル -->
              <img
                :title="post"
                :alt="post"
                class="h-[91px] w-[64px] rounded object-cover object-center"
                src="https://dummyimage.com/128x182"
                height="91"
                width="64"
                decoding="async"
              />

              <div class="flex grow flex-col gap-2">
                <div class="flex flex-row items-end justify-between">
                  <p class="-mb-2 text-xs text-gray-400">
                    <span class="mb-1 block h-3 w-48 animate-pulse rounded-full bg-gray-200"></span>
                  </p>
                  <div class="flex shrink-0 flex-row gap-2">
                    <div
                      class="leading-sm inline-flex items-center rounded-full py-1 text-xs font-bold uppercase"
                    >
                      <Icon class="mr-1 h-4 w-4" icon="akar-icons:heart"> </Icon>
                      {{ Number(post) }}
                    </div>
                  </div>
                </div>
                <p class="text-lg text-gray-900">
                  <span class="block h-7 w-80 animate-pulse rounded-full bg-gray-200"></span>
                </p>
                <div class="flex justify-between">
                  <div class="flex flex-row gap-2 py-2">
                    <p class="text-xs">
                      <span class="block h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                    </p>
                    <p class="text-xs">
                      <span class="block h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <!-- 本体 -->
        <div v-else>
          <div class="flex flex-col gap-4">
            <!-- 投稿のタイトルリスト -->
            <a
              v-for="post of data.post_list"
              :key="post.post_id"
              class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-blue-100"
              @click.prevent="$router.push(`/post/${post.post_id}`)"
            >
              <!-- サムネイル -->
              <img
                :title="post.volume?.volumeInfo?.title ?? ''"
                :alt="post.volume?.volumeInfo?.title ?? ''"
                class="h-[91px] w-[64px] rounded object-cover object-center"
                :src="
                  post.volume?.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/128x182'
                "
                height="91"
                width="64"
                decoding="async"
              />

              <div class="flex grow flex-col gap-2">
                <div class="flex flex-row items-end justify-between">
                  <p class="-mb-2 text-xs text-gray-400">
                    {{ post.volume?.volumeInfo?.title ?? '(本未選択)' }}
                  </p>
                  <div class="flex shrink-0 flex-row gap-2">
                    <div
                      class="leading-sm inline-flex items-center rounded-full py-1 text-xs font-bold uppercase"
                    >
                      <Icon
                        class="mr-1 h-4 w-4"
                        :icon="
                          post.hearts < 5
                            ? 'akar-icons:heart'
                            : post.hearts < 10
                            ? 'bi:hearts'
                            : 'emojione:revolving-hearts'
                        "
                      >
                      </Icon>
                      {{ post.hearts }}
                    </div>
                  </div>
                </div>
                <p class="text-lg text-gray-900">
                  {{ `${post.post_title ? post.post_title : '(タイトル未設定)'}` }}
                </p>
                <div class="flex justify-between">
                  <div class="flex flex-row gap-2 py-2">
                    <p class="text-xs">
                      作成
                      <span class="text-gray-400">{{ post.created_at.toLocaleString() }}</span>
                    </p>
                    <p class="text-xs">
                      更新
                      <span class="text-gray-400">{{ post.updated_at.toLocaleString() }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <!-- ページング -->
          <VxePager
            v-if="data.post_list.length"
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
        </div>
      </Transition>
    </div>

    <div class="flex w-80 shrink-0 flex-col gap-4 py-4">
      <div class="table h-64 w-80 border bg-stone-300 p-4">
        <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
      </div>
      <div class="table h-64 w-80 border bg-stone-300 p-4">
        <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
      </div>
    </div>
  </div>
</template>
