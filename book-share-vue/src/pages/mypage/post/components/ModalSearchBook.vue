<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import SearchBook from '~/pages/book/components/SearchBook.vue';

defineEmits<{
  success: [RouterOutput['book']['getVolume'], PointerEvent];
  close: [];
}>();
</script>

<template>
  <SearchBook
    class="h-screen w-[calc(100vw-2rem)]"
    @selected="(volume, e) => $emit('success', volume, e)"
  >
  </SearchBook>
</template>
