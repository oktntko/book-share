<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';

defineEmits<{
  update: [];
  delete: [];
  post: [];
}>();

defineProps<{
  readingrecord: RouterOutput['readingrecord']['list']['readingrecord_list'][number];
}>();

const showMenu = ref(false);
</script>

<template>
  <div
    class="flex flex-col gap-1 border border-gray-300 bg-white p-4 transition-all"
    :title="readingrecord.volume?.volumeInfo?.description ?? ''"
  >
    <!-- 日付 -->
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <span class="icon-[mdi--read] text-green-800"></span>{{ readingrecord.read_date }}
      </div>
      <div class="relative inline-block text-left">
        <OnClickOutside
          class="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
          @trigger="() => (showMenu = false)"
        >
          <MyButton type="button" classset="icon" colorset="white" @click="showMenu = !showMenu">
            <span class="icon-[solar--menu-dots-bold]"></span>
          </MyButton>
        </OnClickOutside>

        <Transition
          enter-from-class="transform opacity-0 scale-95"
          enter-active-class="transition ease-out duration-100"
          enter-to-class="transform opacity-100 scale-100"
          leave-from-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-show="showMenu"
            class="ring-opacity-5 absolute right-0 z-50 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-black focus:outline-none"
            tabindex="-1"
          >
            <a
              class="block cursor-pointer border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              @click="$emit('post')"
            >
              投稿を書く
            </a>
            <a
              class="block cursor-pointer border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              @click="$emit('update')"
            >
              編集する
            </a>
            <a
              class="block cursor-pointer border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              @click="$emit('delete')"
            >
              削除する
            </a>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 画像 -->
    <div class="flex justify-center">
      <div class="relative">
        <img
          :title="readingrecord.volume?.volumeInfo?.title ?? ''"
          :alt="readingrecord.volume?.volumeInfo?.title ?? ''"
          class="relative z-10 h-[185px] w-[128px] rounded object-cover object-center"
          :src="
            readingrecord.volume?.volumeInfo?.imageLinks?.thumbnail ??
            'https://dummyimage.com/128x185'
          "
          height="185"
          width="128"
          decoding="async"
        />
        <img
          :title="readingrecord.volume?.volumeInfo?.title ?? ''"
          :alt="readingrecord.volume?.volumeInfo?.title ?? ''"
          class="absolute -bottom-2 left-2 z-9 h-[185px] w-[128px] object-cover object-center opacity-80 blur"
          :src="
            readingrecord.volume?.volumeInfo?.imageLinks?.thumbnail ??
            'https://dummyimage.com/128x185'
          "
          height="185"
          width="128"
          decoding="async"
        />
      </div>
    </div>

    <!-- タイトル -->
    <h2
      v-if="readingrecord.volume?.volumeInfo?.title"
      class="line-clamp line-clamp-2 text-lg font-bold"
    >
      {{ readingrecord.volume.volumeInfo.title }}
    </h2>

    <!-- 評価 -->
    <input
      id="star"
      :value="readingrecord.star"
      min="0"
      max="5"
      type="range"
      step="0.5"
      class="rating"
      :style="`--value: ${readingrecord.star}`"
      :title="`${readingrecord.star}`"
    />

    <!-- ひとこと -->
    <div class="block w-full p-2.5 text-gray-600 sm:text-sm">
      {{ readingrecord.hitokoto }}
    </div>
  </div>
</template>

<style scoped>
/* https://blanche-toile.com/web/css-line-clamp-property */
/* 複数行の省略 */
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
}

.rating {
  --dir: right;
  --fill: gold;
  --fillbg: rgba(100, 100, 100, 0.15);
  --star: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.25l-6.188 3.75 1.641-7.031-5.438-4.734 7.172-0.609 2.813-6.609 2.813 6.609 7.172 0.609-5.438 4.734 1.641 7.031z"/></svg>');
  --stars: 5;
  --starsize: 2rem;
  --symbol: var(--star);
  --value: 1;
  --w: calc(var(--stars) * var(--starsize));
  --x: calc(100% * (var(--value) / var(--stars)));
  block-size: var(--starsize);
  inline-size: var(--w);
  position: relative;
  touch-action: manipulation;

  -webkit-appearance: none;
  appearance: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}

/* Track: Firefox */
.rating::-moz-range-track {
  background: linear-gradient(to var(--dir), var(--fill) 0 var(--x), var(--fillbg) 0 var(--x));
  block-size: 100%;
  mask: repeat left center/var(--starsize) var(--symbol);
}

/* Track: Chrome, Safari, Opera, Edge Chromium */
.rating::-webkit-slider-runnable-track {
  background: linear-gradient(to var(--dir), var(--fill) 0 var(--x), var(--fillbg) 0 var(--x));
  block-size: 100%;
  mask: repeat left center/var(--starsize) var(--symbol);
  -webkit-mask: repeat left center/var(--starsize) var(--symbol);
}

/* Thumb: Firefox */
.rating::-moz-range-thumb {
  height: var(--starsize);
  opacity: 0;
  width: var(--starsize);
}

/* Thumb: Chrome, Safari, Opera, Edge Chromium */
.rating::-webkit-slider-thumb {
  height: var(--starsize);
  opacity: 0;
  width: var(--starsize);
  -webkit-appearance: none;
}
</style>
