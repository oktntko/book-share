<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import SearchBook from '~/pages/book/components/SearchBook.vue';

defineEmits<{
  close: [volume?: RouterOutput['book']['getVolume'], event?: PointerEvent];
}>();
</script>

<template>
  <SearchBook
    class="h-screen w-[calc(100vw-2rem)] p-4"
    @selected="(volume, e) => $emit('close', volume, e)"
  >
  </SearchBook>
</template>
