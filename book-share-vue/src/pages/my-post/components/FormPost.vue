<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import Editor from '~/pages/components/Editor.vue';
import { PostRouterSchema } from '~/schema/PostRouterSchema';

export type ModelPost = z.infer<typeof PostRouterSchema.createInput>;
export type ResetPost = typeof reset;

const emit = defineEmits<{
  submit: [reset: ResetPost];
}>();

const modelValue = defineModel<ModelPost>({ required: true });

const { formId, validateSubmit, isDirty, reset } = useValidate(
  PostRouterSchema.createInput,
  modelValue,
);

const handleSubmit = validateSubmit(() => emit('submit', reset));
</script>

<template>
  <form
    class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <section class="flex flex-col gap-4">
      <!-- タイトル -->
      <div class="relative">
        <input
          id="floating_outlined"
          v-model="modelValue.post_title"
          type="text"
          class="peer block w-full appearance-none border border-gray-300 bg-white px-2.5 pb-2.5 pt-4 focus:border-blue-600 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          for="floating_outlined"
          class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          タイトル
        </label>
      </div>
      <!-- エディタ -->
      <Editor v-model="modelValue.content" editable></Editor>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty">
        <Icon icon="entypo:save" class="mr-2 -ml-1 h-5 w-5"> </Icon>
        保存する
      </MyButton>
      <slot name="sub-button"></slot>
    </section>
  </form>
</template>
