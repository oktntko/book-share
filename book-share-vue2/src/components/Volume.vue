<template>
  <div class="flex flex-col gap-2 rounded-lg bg-gray-100 p-5">
    <div class="flex gap-4">
      <!-- サムネイル -->
      <img
        v-if="
          volume.volumeInfo &&
          volume.volumeInfo.imageLinks &&
          volume.volumeInfo.imageLinks.thumbnail
        "
        class="h-[182px] w-[128px] rounded object-cover object-center"
        :src="volume.volumeInfo.imageLinks.thumbnail"
        alt="content"
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
          v-if="volume.volumeInfo.authors"
          class="title-font text-xs text-blue-500 transition-colors hover:text-blue-900 hover:underline"
        >
          {{ volume.volumeInfo.authors.join(", ") }}
        </h3>
        <h2 v-if="volume.volumeInfo.title" class="title-font text-lg font-bold text-gray-900">
          {{ volume.volumeInfo.title }}
        </h2>
        <h2 v-if="volume.volumeInfo.subtitle" class="title-font text-sm text-gray-600">
          {{ volume.volumeInfo.subtitle }}
        </h2>
        <span v-if="volume.volumeInfo.publishedDate" class="title-font text-xs text-gray-600">
          {{ volume.volumeInfo.publishedDate }}
        </span>
        <span v-if="volume.volumeInfo.publisher" class="title-font text-xs text-gray-600">
          {{ volume.volumeInfo.publisher }}
        </span>
        <p v-if="volume.volumeInfo.description" class="line-clamp text-base leading-relaxed">
          {{ volume.volumeInfo.description }}
        </p>
        <footer class="flex items-center justify-end gap-2">
          <a
            v-if="volume.volumeInfo.infoLink"
            :href="volume.volumeInfo.infoLink"
            target="_blank"
            class="flex text-center text-sm font-medium capitalize text-blue-500 transition-colors hover:text-blue-900 hover:underline"
            @click.stop
          >
            google site
          </a>
          <a
            v-if="volume.volumeInfo.previewLink"
            :href="volume.volumeInfo.previewLink"
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
import type { Volume } from "~/components/VolumesSearch.vue";

export default Vue.extend({
  props: {
    volume: {
      type: Object as PropType<Volume>,
      required: false,
      default: () => ({ volumeInfo: {} } as Volume),
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
