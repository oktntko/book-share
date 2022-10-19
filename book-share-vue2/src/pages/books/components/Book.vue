<template>
  <div
    :class="`flex flex-col p-4 transition-all
      ${active ? '!-translate-x-0.5 !-translate-y-0.5 !transform !bg-blue-50 !drop-shadow' : ''}
      ${
        hoverable
          ? 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform hover:bg-white hover:drop-shadow'
          : ''
      }`"
  >
    <div>
      <slot name="header" :book="book"></slot>
    </div>

    <div class="flex gap-4">
      <!-- 左側 -->
      <div class="flex shrink-0 flex-col">
        <!-- サムネイル -->
        <div class="relative mx-auto inline">
          <template
            v-if="
              book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail
            "
          >
            <img
              :title="book.book_title"
              :alt="book.book_title"
              class="relative z-10 h-[185px] w-[128px] rounded object-cover object-center"
              :src="book.volumeInfo.imageLinks.thumbnail"
            />
            <img
              :title="book.book_title"
              :alt="book.book_title"
              class="absolute -bottom-2 left-2 z-[9] h-[185px] w-[128px] object-cover object-center opacity-80 blur"
              :src="book.volumeInfo.imageLinks.thumbnail"
            />
          </template>
          <template v-else>
            <!-- サムネイルがなかった時のダミー画像 -->
            <img
              class="relative z-10 h-[185px] w-[128px] rounded object-cover object-center"
              src="https://dummyimage.com/128x185"
              alt="content"
            />
            <img
              class="absolute -bottom-2 left-2 z-[9] h-[185px] w-[128px] object-cover object-center opacity-80 blur"
              src="https://dummyimage.com/128x185"
              alt="content"
            />
          </template>
        </div>
      </div>
      <!-- 右側 -->
      <div v-if="book.volumeInfo" class="flex flex-col gap-1 text-gray-900">
        <h3 v-if="book.volumeInfo.authors" class="text-xs text-blue-500 transition-colors">
          {{ book.volumeInfo.authors.join(", ") }}
        </h3>
        <h2 v-if="book.book_title" class="line-clamp line-clamp-2 text-lg font-bold">
          {{ book.book_title }}
        </h2>
        <h2 v-if="book.volumeInfo.subtitle" class="text-sm text-gray-600">
          {{ book.volumeInfo.subtitle }}
        </h2>
        <span v-if="book.volumeInfo.publishedDate" class="text-xs text-gray-600">
          {{ book.volumeInfo.publishedDate }}
        </span>
        <span v-if="book.volumeInfo.publisher" class="text-xs text-gray-600">
          {{ book.volumeInfo.publisher }}
        </span>
        <footer class="flex flex-wrap items-start justify-start gap-2">
          <a
            v-if="book.volumeInfo.infoLink"
            :href="book.volumeInfo.infoLink"
            target="_blank"
            class="flex w-[140px] items-center justify-center rounded-md border bg-white py-2 px-2 text-center text-sm font-medium capitalize text-blue-500 transition-colors hover:text-blue-900 hover:underline"
            @click.stop
          >
            <Icon icon="bi:google-play" class="mr-1"></Icon>
            Google Books
          </a>
          <a
            v-if="book.volumeInfo.previewLink"
            :href="book.volumeInfo.previewLink"
            target="_blank"
            class="flex w-[140px] items-center justify-center rounded-md border bg-white py-2 px-2 text-center text-sm font-medium text-blue-500 transition-colors hover:text-blue-900 hover:underline"
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
      v-if="showDescription && book.volumeInfo && book.volumeInfo.description"
      class="line-clamp line-clamp-4 text-base leading-relaxed"
    >
      {{ book.volumeInfo.description }}
    </p>

    <!-- 拡張 -->
    <div>
      <slot name="footer" :book="book"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Book } from "~/libs/trpc";

export default Vue.extend({
  props: {
    book: {
      type: Object as PropType<Book>,
      required: false,
      default: () => ({} as Book),
    },
    hoverable: {
      type: Boolean,
      required: false,
      default: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    showDescription: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>

<style scoped></style>
