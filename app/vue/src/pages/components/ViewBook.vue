<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';

withDefaults(
  defineProps<{
    volume?: RouterOutput['book']['getVolume'];
    hoverable?: boolean;
    active?: boolean;
    showDescription?: boolean;
  }>(),
  {
    volume: () => ({}),
    hoverable: true,
    active: false,
    showDescription: true,
  },
);
</script>

<template>
  <div
    :class="[
      'flex flex-col border border-gray-300 bg-white p-4 transition-all',
      active ? '!-translate-x-0.5 !-translate-y-0.5 !transform !bg-blue-50 !drop-shadow' : '',
      hoverable ? 'hover:bg-blue-100' : '',
    ]"
  >
    <div>
      <slot name="header" :volume="volume"></slot>
    </div>

    <div class="flex gap-4">
      <!-- 左側 -->
      <div class="flex shrink-0 flex-col">
        <!-- サムネイル -->
        <div class="relative mx-auto inline">
          <img
            :title="volume.volumeInfo?.title ?? ''"
            :alt="volume.volumeInfo?.title ?? ''"
            class="relative z-10 h-[185px] w-[128px] rounded object-cover object-center"
            :src="volume.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/128x185'"
            height="185"
            width="128"
            decoding="async"
          />
          <img
            :title="volume.volumeInfo?.title ?? ''"
            :alt="volume.volumeInfo?.title ?? ''"
            class="absolute -bottom-2 left-2 z-[9] h-[185px] w-[128px] object-cover object-center opacity-80 blur"
            :src="volume.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/128x185'"
            height="185"
            width="128"
            decoding="async"
          />
        </div>
      </div>
      <!-- 右側 -->
      <div v-if="volume.volumeInfo" class="flex flex-col gap-1 text-gray-900">
        <h3 v-if="volume.volumeInfo?.authors" class="text-xs text-blue-500 transition-colors">
          {{ volume.volumeInfo?.authors.join(', ') }}
        </h3>
        <h2 v-if="volume.volumeInfo?.title" class="line-clamp line-clamp-2 text-lg font-bold">
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
        <footer class="flex flex-wrap items-start justify-start gap-2">
          <a
            v-if="volume.volumeInfo?.infoLink"
            :href="volume.volumeInfo?.infoLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium !text-blue-500 shadow-sm transition-all hover:bg-gray-200 hover:underline focus:outline-none focus:ring"
            @click.stop
          >
            <Icon icon="bi:google-play" class="mr-1"></Icon>
            Google Books
          </a>
          <a
            v-if="volume.volumeInfo?.previewLink"
            :href="volume.volumeInfo?.previewLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium !text-blue-500 shadow-sm transition-all hover:bg-gray-200 hover:underline focus:outline-none focus:ring"
            @click.stop
          >
            <Icon icon="fluent-emoji-high-contrast:free-button" class="mr-1"></Icon>
            無料サンプル
          </a>
        </footer>
      </div>
    </div>

    <!-- 詳細 -->
    <p
      v-if="showDescription && volume.volumeInfo?.description"
      class="line-clamp line-clamp-4 text-base leading-relaxed"
    >
      {{ volume.volumeInfo?.description }}
    </p>

    <!-- 拡張 -->
    <div>
      <slot name="footer" :volume="volume"></slot>
    </div>
  </div>
</template>

<style scoped>
/* https://blanche-toile.com/web/css-line-clamp-property */
/* 複数行の省略 */
.line-clamp {
  margin: 1rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
}
.line-clamp-3 {
  -webkit-line-clamp: 3;
}
.line-clamp-4 {
  -webkit-line-clamp: 4;
}
.line-clamp-5 {
  -webkit-line-clamp: 5;
}
.line-clamp-6 {
  -webkit-line-clamp: 6;
}
</style>
