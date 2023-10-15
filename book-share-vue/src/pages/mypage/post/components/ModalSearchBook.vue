<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import SearchBook from '~/pages/book/components/SearchBook.vue';

defineEmits<{
  close: [volume?: RouterOutput['book']['getVolume'], event?: MouseEvent];
}>();
</script>

<template>
  <SearchBook @selected="(volume, e) => $emit('close', volume, e)"> </SearchBook>
</template>
