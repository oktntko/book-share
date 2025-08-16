<script setup lang="ts">
import { ProfileRouterSchema } from '@book-share/express/schema';
import type { z } from '@book-share/lib/zod';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import { bytesToBase64 } from '~/lib/file';
import { trpc } from '~/lib/trpc';
import { useDialog } from '~/plugin/DialogPlugin';

const $dialog = useDialog();
const user = await trpc.profile.get.query();

const modelValue = ref<z.infer<typeof ProfileRouterSchema.patchProfileInput>>(user);

const { validateSubmit, ErrorMessage, isDirty, reset } = useVueValidateZod(
  ProfileRouterSchema.patchProfileInput,
  modelValue,
);

const dragging = ref(false);

async function handleFileInput(files?: FileList | null) {
  if (files == null || files.length === 0) {
    return;
  }

  const file = files[0]!;

  if (!file.type.startsWith('image/')) {
    $dialog.alert('Choose a IMAGE file.');
    return;
  }

  if (file.size > 1024 * 1000 /* 1MB */) {
    $dialog.alert('The upper limit is 1MB.');
    return;
  }

  modelValue.value.avatar_image = await bytesToBase64(file);
}
</script>

<template>
  <form
    class="flex flex-col gap-8"
    autocomplete="off"
    @submit.prevent="
      validateSubmit(async () => {
        const loading = $loading.open();
        try {
          const user = await trpc.profile.patchProfile.mutate(modelValue);

          reset(user);

          $toast.success('データを保存しました。');
        } finally {
          loading.close();
        }
      })()
    "
  >
    <section class="flex flex-col gap-4 md:flex-row md:gap-8">
      <div class="flex grow flex-col gap-4">
        <!-- 名前 -->
        <div>
          <label
            for="username"
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          >
            名前
          </label>
          <input
            id="username"
            v-model.lazy="modelValue.username"
            type="text"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
          />
          <ErrorMessage class="text-xs text-red-600" field="username" />
        </div>
        <!-- メールアドレス -->
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            メールアドレス
          </label>
          <input
            id="email"
            v-model.lazy="modelValue.email"
            type="email"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
          />
          <ErrorMessage class="text-xs text-red-600" field="email" />
        </div>
        <!-- 自己紹介 -->
        <div>
          <label
            for="description"
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          >
            自己紹介
          </label>
          <textarea
            id="description"
            v-model.lazy="modelValue.description"
            rows="4"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          ></textarea>

          <ErrorMessage class="text-xs text-red-600" field="description" />
        </div>
      </div>
      <!-- 画像 -->
      <div class="flex flex-col items-center gap-4">
        <div v-if="modelValue.avatar_image" class="relative h-64 w-64">
          <img
            :src="modelValue.avatar_image"
            width="256"
            height="256"
            decoding="async"
            class="h-64 w-64 rounded-sm object-cover object-center"
            alt="avatar"
          />
          <button
            type="button"
            class="absolute top-[-8px] right-[-8px] flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 transition-colors hover:bg-gray-200"
            aria-label="Close"
            @click="modelValue.avatar_image = ''"
          >
            <span class="icon-[bi--x] h-4 w-4" />
          </button>
        </div>

        <!-- 画像がないとき -->
        <label
          v-else
          :class="[
            'relative flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-sm border-2 border-dashed border-gray-300 bg-gray-100 px-1 text-center text-gray-400 transition-colors hover:bg-gray-200',
            dragging ? 'border-gray-500 bg-gray-200' : '',
          ]"
          @dragenter="dragging = true"
          @dragleave="
            (e) => {
              // 子要素へ dragenter すると自身の dragleave が発火するため、子要素かどうか判定する
              // https://qiita.com/keiliving/items/5e8b26e6567efbc15765
              if (e.relatedTarget && e.currentTarget) {
                const currentTarget = e.currentTarget as Node;
                const relatedTarget = e.relatedTarget as Node;
                if (currentTarget.contains(relatedTarget)) {
                  return;
                }
              }

              dragging = false;
            }
          "
          @dragover.prevent
          @drop.prevent="
            (e) => {
              dragging = false;
              handleFileInput(e.dataTransfer?.files);
            }
          "
        >
          <span class="sr-only capitalize">space image</span>
          <span class="icon-[ri--image-circle-fill] h-32 w-32"> </span>
          <span class="text-xs capitalize">limit: 1MB</span>
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="(e) => handleFileInput((e.target as HTMLInputElement | null)?.files)"
          />
        </label>
      </div>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty">
        登録
      </MyButton>
      <slot name="sub-button"></slot>
    </section>
  </form>
</template>
