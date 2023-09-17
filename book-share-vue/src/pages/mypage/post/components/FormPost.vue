<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import Editor from '~/pages/components/Editor.vue';
import ViewBook from '~/pages/components/ViewBook.vue';
import ModalSearchBook from '~/pages/mypage/post/components/ModalSearchBook.vue';
import { useModal } from '~/plugin/ModalPlugin';
import { PostRouterSchema } from '~/schema/PostRouterSchema';

export type ModelPost = z.infer<typeof PostRouterSchema.createInput>;
export type ResetPost = typeof reset;

const emit = defineEmits<{
  submit: [value: ModelPost, reset: ResetPost];
}>();

const modelValue = defineModel<ModelPost>({ required: true });
const volume = defineModel<RouterOutput['book']['getVolume'] | undefined>('volume', {
  required: true,
});

const { validateSubmit, ErrorMessage, isDirty, reset } = useValidate(
  PostRouterSchema.createInput,
  modelValue,
);

const handleSubmit = validateSubmit(() => emit('submit', modelValue.value, reset));

const modal = useModal();
async function openModalSearchBook() {
  const selectedVolume = await modal.open<RouterOutput['book']['getVolume'] | undefined>({
    component: ModalSearchBook,
    componentProps: {},
    componentEvents: {},
  });

  if (selectedVolume) {
    volume.value = selectedVolume;
    modelValue.value.volume_id = selectedVolume.id ?? '';
    modelValue.value.book_title = selectedVolume.volumeInfo?.title ?? '';
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <section class="flex flex-col gap-4">
      <!-- 選択した本 -->
      <div v-show="volume" class="relative">
        <ViewBook class="rounded border bg-gray-100" :volume="volume" :hoverable="false">
        </ViewBook>
        <div class="absolute right-4 top-2">
          <div class="flex gap-4">
            <MyButton
              type="button"
              classset="text"
              colorset="blue"
              secondary
              @click="openModalSearchBook"
            >
              <Icon icon="flat-color-icons:search" class="-ml-1 mr-2 h-4 w-4"></Icon>
              本を探す
            </MyButton>
            <MyButton
              type="button"
              classset="text"
              colorset="white"
              @click="
                () => {
                  volume = undefined;
                  modelValue.volume_id = '';
                  modelValue.book_title = '';
                }
              "
            >
              <Icon icon="bi:x" class="-ml-1 mr-2 h-4 w-4"></Icon>
              リセット
            </MyButton>
          </div>
        </div>
      </div>
      <!-- 本が選択されなかったときは、本を探してほしいメッセージ -->
      <div
        v-show="!volume"
        class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300"
        role="alert"
      >
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">投稿を書く本を見つけましょう！</h3>
        </div>
        <div class="mb-4 mt-2 text-sm text-blue-900">
          本を選ぶと、あなたの投稿を見つけやすくなります。
        </div>
        <div class="flex">
          <MyButton
            type="button"
            classset="text"
            colorset="blue"
            secondary
            @click="openModalSearchBook"
          >
            <Icon icon="flat-color-icons:search" class="-ml-1 mr-2 h-4 w-4"></Icon>
            本を探す
          </MyButton>
        </div>
      </div>

      <!-- タイトル -->
      <div class="relative">
        <input
          id="post_title"
          v-model="modelValue.post_title"
          type="text"
          class="peer block w-full appearance-none border border-gray-300 bg-white px-2.5 pb-2.5 pt-4 focus:border-blue-600 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          maxlength="255"
        />
        <label
          for="post_title"
          class="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          タイトル
        </label>
        <ErrorMessage class="text-xs text-red-600" for="post_title" />
      </div>
      <!-- エディタ -->
      <Editor v-model="modelValue.content" editable></Editor>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty">
        <Icon icon="entypo:save" class="-ml-1 mr-2 h-5 w-5"> </Icon>
        保存する
      </MyButton>
      <slot name="sub-button"></slot>
    </section>
  </form>
</template>
