<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface Props extends /* @vue-ignore */ ButtonHTMLAttributes {
  classset?: 'text' | 'icon' | 'none';
  colorset?: 'blue' | 'green' | 'yellow' | 'red' | 'white' | 'none';
  secondary?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  classset: 'none',
  colorset: 'none',
  secondary: false,
});
</script>

<template>
  <button
    class="inline-flex items-center justify-center shadow-sm transition-all focus:ring focus:outline-none"
    :class="{
      'min-w-[120px] rounded-md border px-4 py-2 text-sm font-medium': props.classset === 'text',
      'rounded-3xl border p-1': props.classset === 'icon',
      'border-green-700 bg-green-600 text-white hover:bg-green-800':
        props.colorset === 'green' && !secondary,
      'border-green-700 bg-white text-green-700 hover:bg-green-800 hover:text-white':
        props.colorset === 'green' && secondary,

      'border-yellow-500 bg-yellow-400 text-gray-800 hover:bg-yellow-600':
        props.colorset === 'yellow' && !secondary,
      'border-yellow-500 bg-white text-yellow-800 hover:bg-yellow-500 hover:text-gray-800':
        props.colorset === 'yellow' && secondary,

      'border-red-700 bg-red-600 text-white hover:bg-red-800':
        props.colorset === 'red' && !secondary,
      'border-red-700 bg-white text-red-700 hover:bg-red-800 hover:text-white':
        props.colorset === 'red' && secondary,

      'border-blue-700 bg-blue-600 text-white hover:bg-blue-800':
        props.colorset === 'blue' && !secondary,
      'border-blue-700 bg-white text-blue-700 hover:bg-blue-800 hover:text-white':
        props.colorset === 'blue' && secondary,

      'border-gray-300 bg-white text-gray-800 hover:bg-gray-200': props.colorset === 'white',
    }"
    v-bind="props"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button:disabled {
  /* .bg-gray-300 { */
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity));
  /* } */
  /* .text-gray-100 { */
  --tw-text-opacity: 1;
  color: rgb(243 244 246 / var(--tw-text-opacity));
  /* } */
  /* .border-gray-300 { */
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
  /* } */
  /* .cursor-not-allowed { */
  cursor: not-allowed;
  /* } */
}
</style>
