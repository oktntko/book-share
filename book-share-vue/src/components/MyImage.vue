<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue';

interface Props extends /* @vue-ignore */ ImgHTMLAttributes {
  srcBase: string;
}
const props = defineProps<Props>();
const BASE_URL = import.meta.env.BASE_URL;
const src = computed(() => {
  return props.srcBase.startsWith('api/') ? `${BASE_URL}${props.srcBase}` : props.srcBase;
});
</script>

<template>
  <img v-bind="props" :height="props.height" :width="props.decoding" decoding="async" :src="src" />
</template>
