<script setup lang="ts">
// https://ja.vuejs.org/guide/components/attrs.html#disabling-attribute-inheritance
defineOptions({ inheritAttrs: false });

const modelValue = defineModel<string>({ default: '' });

const show = ref(false);
</script>

<template>
  <div class="relative">
    <input v-model="modelValue" :type="show ? 'text' : 'password'" v-bind="$attrs" />
    <div
      class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-sm leading-5"
      @click="show = !show"
    >
      <Icon v-if="!show" icon="fa6-solid:eye"></Icon>
      <Icon v-if="show" icon="fa6-solid:eye-slash"></Icon>
    </div>
  </div>
</template>
