<template>
  <div class="flex flex-col gap-2 rounded border bg-white p-4">
    <div class="flex gap-4">
      <!-- サムネイル -->
      <img
        v-if="book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail"
        :title="book.book_title"
        :alt="book.book_title"
        class="h-[182px] w-[128px] rounded object-cover object-center"
        :src="book.volumeInfo.imageLinks.thumbnail"
      />
      <!-- サムネイルがなかった時のダミー画像 -->
      <img
        v-else
        class="h-[182px] w-[128px] rounded object-cover object-center"
        src="https://dummyimage.com/128x182"
        alt="content"
      />
      <!-- 本の情報 -->
      <div class="hidden flex-col gap-1 lg:flex">
        <h3
          v-if="book.volumeInfo.authors"
          class="title-font text-xs text-blue-500 transition-colors hover:text-blue-900 hover:underline"
        >
          {{ book.volumeInfo.authors.join(", ") }}
        </h3>
        <h2 v-if="book.book_title" class="title-font text-lg font-bold text-gray-900">
          {{ book.book_title }}
        </h2>
        <h2 v-if="book.volumeInfo.subtitle" class="title-font text-sm text-gray-600">
          {{ book.volumeInfo.subtitle }}
        </h2>
        <span v-if="book.volumeInfo.publishedDate" class="title-font text-xs text-gray-600">
          {{ book.volumeInfo.publishedDate }}
        </span>
        <span v-if="book.volumeInfo.publisher" class="title-font text-xs text-gray-600">
          {{ book.volumeInfo.publisher }}
        </span>
        <p v-if="book.volumeInfo.description" class="line-clamp text-base leading-relaxed">
          {{ book.volumeInfo.description }}
        </p>
        <footer class="flex items-center justify-end gap-2">
          <a
            v-if="book.volumeInfo.infoLink"
            :href="book.volumeInfo.infoLink"
            target="_blank"
            class="flex text-center text-sm font-medium capitalize text-blue-500 transition-colors hover:text-blue-900 hover:underline"
            @click.stop
          >
            google site
          </a>
          <a
            v-if="book.volumeInfo.previewLink"
            :href="book.volumeInfo.previewLink"
            target="_blank"
            class="flex text-center text-sm font-medium text-blue-500 transition-colors hover:text-blue-900 hover:underline"
            @click.stop
          >
            サンプル
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import type { PropType } from "vue/types/v3-component-props";
import { Book } from "~/libs/trpc";

export default Vue.extend({
  props: {
    book: {
      type: Object as PropType<Book>,
      required: false,
      default: () => ({ volumeInfo: {} } as Book),
    },
  },
});
</script>

<style scoped>
.line-clamp {
  margin: 1rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
}
</style>
