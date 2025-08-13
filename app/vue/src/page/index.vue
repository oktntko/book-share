<script setup lang="ts">
import { PostRouterSchema } from '@book-share/express/schema';
import { dayjs } from '@book-share/lib/dayjs';
import { R } from '@book-share/lib/remeda';
import type { z } from '@book-share/lib/zod';
import { SearchParamPostSpanList, type SearchParamPostSpanEnum } from '@book-share/prisma/schema';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import { onBeforeRouteUpdate } from 'vue-router';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';

const $route = useRoute('/');
// TODO F5で更新すると、フォームに値がない状態でクエリから検索条件に指定されてしまう
const keyword = typeof $route.query.keyword === 'string' ? $route.query.keyword : '';
// TODO 本を探すから渡された volume_id を処理していない

const modelValue = ref<z.infer<typeof PostRouterSchema.listInput>>({
  // TODO 個人用とINPUTを分ける
  where: {
    keyword,
    postStatus: '',
  },
  sort: {
    field: 'created_at',
    order: 'desc',
  },
  limit: 30,
  page: 1,
});

onBeforeRouteUpdate((to) => {
  if (typeof to.query.keyword === 'string') {
    modelValue.value.where.keyword = to.query.keyword;
  } else {
    modelValue.value.where.keyword = '';
  }
  return handleSubmit();
});

const { validateSubmit } = useVueValidateZod(PostRouterSchema.listInput, modelValue);

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

const refCarousel = useTemplateRef<HTMLDivElement>('refCarousel');
const carouselScrolling = ref(false);
function scrollCarousel(direction: number) {
  if (carouselScrolling.value) {
    return;
  }

  const container = refCarousel.value;
  const item = container?.querySelector('div');
  if (container == null || item == null) {
    return;
  }

  const itemWidth = item.clientWidth;
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if (direction > 0) {
    if (Math.ceil(container.scrollLeft) >= maxScrollLeft) {
      // 右端なら最初に戻る
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: itemWidth * direction, behavior: 'smooth' });
    }
  } else {
    // 左スクロール
    if (container.scrollLeft <= 0) {
      // 左端なら最後に送る
      container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: itemWidth * direction, behavior: 'smooth' });
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-8 px-4 py-4 lg:flex-row xl:container xl:mx-auto">
    <div class="w-full shrink-0 py-4 lg:w-64 xl:w-80">
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
      <div class="relative">
        <button
          type="button"
          class="absolute top-1/2 z-20 inline-flex -translate-y-1/2 items-center justify-center rounded-full border p-2 shadow transition-colors"
          :class="[
            'left-2',
            'lg:hidden',
            'border-gray-200 bg-white text-blue-600',
            'hover:border-blue-200 hover:bg-blue-500 hover:text-white',
          ]"
          :disabled="carouselScrolling"
          @click="scrollCarousel(-1)"
        >
          <span class="icon-[mingcute--left-fill] h-4 w-4"></span>
        </button>
        <Transition
          mode="out-in"
          enter-from-class="transform opacity-0"
          enter-active-class="transition ease-out duration-200"
          enter-to-class="transform opacity-100"
          leave-from-class="transform opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-to-class="transform opacity-0"
        >
          <div
            v-if="loadingRanking"
            ref="refCarousel"
            class="grid snap-x snap-mandatory grid-flow-col gap-2 overflow-x-auto scroll-smooth py-4 lg:flex lg:flex-col"
          >
            <div
              v-for="volume of R.range(0, 8).reverse()"
              :key="volume"
              class="row-span-4 grid w-full min-w-64 shrink-0 snap-center grid-rows-subgrid gap-2 rounded border border-gray-300 bg-white p-4 lg:flex lg:min-w-auto lg:flex-col"
            >
              <!-- 上 -->
              <div class="line-clamp-2 text-base font-bold text-gray-900">
                <span class="block h-6 w-full animate-pulse rounded-full bg-gray-200"> </span>
              </div>

              <!-- サムネイル -->
              <div class="flex shrink-0 flex-col">
                <div class="relative mx-auto inline">
                  <img
                    title="skeleton"
                    alt="skeleton"
                    class="relative z-10 h-48 w-32 rounded object-cover object-center"
                    src="https://dummyimage.com/128x192"
                    height="192"
                    width="128"
                    decoding="async"
                  />
                  <img
                    title="skeleton"
                    alt="skeleton"
                    class="absolute -bottom-1 left-1 z-9 h-48 w-32 object-cover object-center opacity-80 blur"
                    src="https://dummyimage.com/128x192"
                    height="192"
                    width="128"
                    decoding="async"
                  />
                </div>
              </div>

              <!-- 下 -->
              <div class="text-xs text-gray-600">
                <span class="block h-4 w-full animate-pulse rounded-full bg-gray-200"></span>
              </div>

              <div class="flex min-w-full flex-row gap-2">
                <div class="shrink truncate text-xs text-gray-900">
                  <span class="block h-4 w-24 animate-pulse rounded-full bg-gray-200"></span>
                </div>
                <div class="shrink truncate text-xs text-gray-600">
                  <span class="block h-4 w-12 animate-pulse rounded-full bg-gray-200"></span>
                </div>
                <div class="shrink-0 text-xs text-gray-600">
                  <span class="block h-4 w-12 animate-pulse rounded-full bg-gray-200"></span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            ref="refCarousel"
            class="grid snap-x snap-mandatory grid-flow-col gap-2 overflow-x-auto scroll-smooth py-4 lg:flex lg:flex-col"
            @scroll="
              (e) => {
                if (e.target === refCarousel) {
                  carouselScrolling = true;
                }
              }
            "
            @scrollend="
              (e) => {
                if (e.target === refCarousel) {
                  carouselScrolling = false;
                }
              }
            "
          >
            <div
              v-for="volume of ranking.volume_list"
              :key="volume.id!!"
              class="row-span-4 grid min-w-64 shrink-0 snap-center grid-rows-subgrid gap-2 rounded border border-gray-300 bg-white p-4 lg:flex lg:min-w-auto lg:flex-col"
            >
              <!-- 上 -->
              <div
                class="line-clamp-2 text-base font-bold text-gray-900"
                :title="volume.volumeInfo?.title"
              >
                {{ volume.volumeInfo?.title }}
              </div>
              <!-- 真ん中 -->
              <div class="flex shrink-0 flex-col">
                <!-- サムネイル -->
                <div class="relative mx-auto inline">
                  <img
                    :title="volume.volumeInfo?.title ?? ''"
                    :alt="volume.volumeInfo?.title ?? ''"
                    class="relative z-10 h-48 w-32 rounded object-cover object-center"
                    :src="
                      volume.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/128x192'
                    "
                    height="192"
                    width="128"
                    decoding="async"
                  />
                  <img
                    :title="volume.volumeInfo?.title ?? ''"
                    :alt="volume.volumeInfo?.title ?? ''"
                    class="absolute -bottom-1 left-1 z-9 h-48 w-32 object-cover object-center opacity-80 blur"
                    :src="
                      volume.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/128x192'
                    "
                    height="192"
                    width="128"
                    decoding="async"
                  />
                </div>
              </div>
              <!-- 下 -->
              <div class="text-xs text-gray-600" :title="volume.volumeInfo?.subtitle">
                {{ volume.volumeInfo?.subtitle }}
              </div>

              <div class="flex min-w-full flex-row gap-2">
                <div
                  v-if="volume.volumeInfo?.authors"
                  class="shrink truncate text-xs text-gray-900"
                  :title="volume.volumeInfo?.authors.join(', ')"
                >
                  {{ volume.volumeInfo?.authors.join(', ') }}
                </div>
                <div
                  v-if="volume.volumeInfo?.publisher"
                  class="shrink truncate text-xs text-gray-600"
                  :title="volume.volumeInfo?.publisher"
                >
                  {{ volume.volumeInfo?.publisher }}
                </div>
                <div
                  v-if="volume.volumeInfo?.publishedDate"
                  class="shrink-0 text-xs text-gray-600"
                  :title="volume.volumeInfo?.publishedDate"
                >
                  {{ volume.volumeInfo?.publishedDate }}
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <!-- 右ボタン -->
        <button
          type="button"
          class="absolute top-1/2 z-20 inline-flex -translate-y-1/2 items-center justify-center rounded-full border p-2 shadow transition-colors"
          :class="[
            'right-2',
            'lg:hidden',
            'border-gray-200 bg-white text-blue-600',
            'hover:border-blue-200 hover:bg-blue-500 hover:text-white',
          ]"
          :disabled="carouselScrolling"
          @click="scrollCarousel(1)"
        >
          <span class="icon-[mingcute--right-fill] h-4 w-4"></span>
        </button>
      </div>
    </div>

    <div class="flex grow flex-col justify-start gap-4">
      <header class="flex items-center justify-between lg:hidden">
        <p>最近の投稿</p>
      </header>
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
              v-for="post of R.range(0, 8)"
              :key="post"
              class="relative flex flex-row gap-2 rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-blue-100"
            >
              <!-- サムネイル -->
              <img
                title="skeleton"
                alt="skeleton"
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
                      <span class="icon-[akar-icons--heart] mr-1 h-4 w-4"> </span>
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
                      <span class="block h-4 w-32 rounded-full bg-gray-200"></span>
                    </p>
                    <p class="text-xs">
                      <span class="block h-4 w-32 rounded-full bg-gray-200"></span>
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
            <RouterLink
              v-for="post of data.post_list"
              :key="post.post_id"
              :to="{
                name: `/post/[post_id]`,
                params: {
                  post_id: post.post_id,
                },
              }"
              class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-blue-100"
            >
              <!-- サムネイル -->
              <div class="flex shrink-0 items-center justify-center">
                <img
                  :title="post.volume?.volumeInfo?.title ?? ''"
                  :alt="post.volume?.volumeInfo?.title ?? ''"
                  class="h-24 w-16 rounded object-cover object-center"
                  :src="
                    post.volume?.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/64x96'
                  "
                  height="96"
                  width="64"
                  decoding="async"
                />
              </div>

              <div class="flex grow flex-col gap-2">
                <div class="line-clamp-1 text-xs text-gray-400">
                  {{ post.volume?.volumeInfo?.title ?? '(本未選択)' }}
                </div>
                <div class="line-clamp-2 grow text-lg text-gray-900">
                  {{ `${post.post_title ? post.post_title : '(タイトル未設定)'}` }}
                </div>
                <div class="flex flex-row items-center gap-2 text-xs text-gray-400">
                  <img
                    v-if="post.toukousya.avatar_image"
                    :src="post.toukousya.avatar_image"
                    width="24"
                    height="24"
                    decoding="async"
                    class="h-6 w-6 rounded-full object-cover object-center"
                    alt="avatar"
                  />
                  <span
                    v-else
                    class="icon-[clarity--avatar-solid] h-6 w-6 rounded-full object-cover object-center"
                  ></span>
                  <div>
                    {{ post.toukousya.username }}
                  </div>
                  <div>
                    <span>
                      {{ dayjs.duration(dayjs(post.published_at).diff(dayjs())).humanize(true) }}
                    </span>
                  </div>
                  <div
                    v-if="
                      post.published_at &&
                      (post.updated_at.getTime() - post.published_at.getTime()) /
                        (1000 * 60 * 60 * 24) >
                        1
                    "
                  >
                    最終更新
                    <span>
                      {{ dayjs.duration(dayjs(post.updated_at).diff(dayjs())).humanize(true) }}
                    </span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- TODO ハート -->
          <!-- <div class="flex shrink-0 flex-row gap-2">
                    <div
                      class="leading-sm inline-flex items-center rounded-full py-1 text-xs font-bold uppercase"
                    >
                      <span
                        class="mr-1 h-4 w-4"
                        :class="
                          post.hearts < 5
                            ? 'icon-[akar-icons--heart]'
                            : post.hearts < 10
                              ? 'icon-[bi--hearts]'
                              : 'icon-[emojione--revolving-hearts]'
                        "
                      >
                      </span>
                      {{ post.hearts }}
                    </div>
                  </div> -->
          <!-- ページング -->
          <!-- TODO Paginator -->
          <!-- <Paginator
            v-if="data.post_list.length"
            dt=""
            :loading="loading"
            :current-page="modelValue.offset / modelValue.limit + 1"
            :totalRecords="data.total"
            :rows="modelValue.limit"
            :rowsPerPageOptions="[10, 20, 30, 40]"
            perfect
            @page-change="
              ({ pageSize, currentPage }) => {
                modelValue.limit = pageSize;
                modelValue.offset = (currentPage - 1) * pageSize;

                handleSubmit();
              }
            "
          ></Paginator> -->
        </div>
      </Transition>
    </div>

    <div class="flex w-48 shrink-0 flex-col gap-4 py-4 xl:w-64">
      <header class="flex items-center justify-between lg:hidden">
        <p>お知らせ</p>
      </header>
      <div class="table h-32 w-48 border border-gray-200 bg-stone-300 p-4 xl:h-48 xl:w-64">
        <span class="table-cell text-center align-middle text-2xl text-gray-400">広告スペース</span>
      </div>
      <div class="table h-32 w-48 border border-gray-200 bg-stone-300 p-4 xl:h-48 xl:w-64">
        <span class="table-cell text-center align-middle text-2xl text-gray-400">広告スペース</span>
      </div>
    </div>
  </div>
</template>
