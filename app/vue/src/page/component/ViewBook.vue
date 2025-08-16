<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';

const {
  volume,
  hoverable = true,
  active = false,
  showDescription = true,
} = defineProps<{
  volume: RouterOutput['book']['getVolume'];
  hoverable?: boolean;
  active?: boolean;
  showDescription?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'flex flex-col gap-2 border border-gray-300 bg-white p-4 transition-all',
      active ? '-translate-x-0.5! -translate-y-0.5! transform! bg-blue-50! drop-shadow!' : '',
      hoverable ? 'hover:bg-blue-100' : '',
    ]"
  >
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
            class="absolute -bottom-2 left-2 z-9 h-[185px] w-[128px] object-cover object-center opacity-80 blur"
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
        <h2 v-if="volume.volumeInfo?.title" class="line-clamp-2 text-lg font-bold">
          {{ volume.volumeInfo?.title }}
        </h2>
        <h2 v-if="volume.volumeInfo?.subtitle" class="line-clamp-2 text-sm text-gray-600">
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
            class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-500! shadow-sm transition-all hover:bg-gray-200 hover:underline focus:ring focus:outline-none"
            @click.stop
          >
            <span class="icon-[bi--google-play] mr-1"></span>
            Google Books
          </a>
          <a
            v-if="volume.volumeInfo?.previewLink"
            :href="volume.volumeInfo?.previewLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-500! shadow-sm transition-all hover:bg-gray-200 hover:underline focus:ring focus:outline-none"
            @click.stop
          >
            <span class="icon-[fluent-emoji-high-contrast--free-button] mr-1"></span>
            無料サンプル
          </a>
        </footer>
      </div>
    </div>

    <!-- 詳細 -->
    <p
      v-if="showDescription && volume.volumeInfo?.description"
      class="line-clamp-4 text-xs leading-relaxed"
    >
      {{ volume.volumeInfo?.description }}
    </p>
  </div>
</template>
