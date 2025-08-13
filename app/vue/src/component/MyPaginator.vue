<script setup lang="ts">
import { R } from '@book-share/lib/remeda';

const {
  currentPage,
  total,
  limit,
  pageWidth = 5,
  disabled = false,
} = defineProps<{
  currentPage: number;
  total: number;
  limit: number;
  pageWidth?: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [number];
}>();

const leftPage = computed(() => {
  const leftSize = Math.ceil(pageWidth / 2);
  return currentPage - leftSize <= 0 ? 1 : currentPage - leftSize;
});

const maxPage = computed(() => {
  return Math.ceil(total / limit);
});

const rightPage = computed(() => {
  return leftPage.value + pageWidth >= maxPage.value ? maxPage.value : leftPage.value + pageWidth;
});
</script>

<template>
  <!-- TODO 挙動がおかしい -->
  <div class="flex items-center justify-center gap-4 px-4 py-2 text-sm">
    <ul class="inline-flex h-10 items-center -space-x-px text-base">
      <li v-for="page in R.range(leftPage, rightPage + 1)" :key="page">
        <button
          type="button"
          :disabled="disabled"
          class="flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="[{ 'text-blue-500!': currentPage === page }]"
          @click="emit('click', page)"
        >
          {{ page }}
        </button>
      </li>
    </ul>
  </div>
</template>
