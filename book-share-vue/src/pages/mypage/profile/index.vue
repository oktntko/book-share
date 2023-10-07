<script setup lang="ts">
import type { z } from 'zod';
import MyInputFile from '~/components/MyInputFile.vue';
import { useValidate } from '~/composables/useValidate';
import { uploadSingleFile } from '~/lib/axios';
import { trpc } from '~/middleware/trpc';
import { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';

const user = await trpc.profile.get.query();

const modelValue = ref<z.infer<typeof ProfileRouterSchema.patchProfileInput>>(user);

const { validateSubmit, ErrorMessage, isDirty, reset } = useValidate(
  ProfileRouterSchema.patchProfileInput,
  modelValue,
);

const file = ref<File>();
const preview = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));
</script>

<template>
  <form
    class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl"
    autocomplete="off"
    @submit.prevent="
      validateSubmit(async () => {
        if (file) {
          try {
            const {
              data: { file_id },
            } = await uploadSingleFile(file);

            modelValue.avatar_file_id = file_id;
            file = undefined;
          } catch {
            $dialog.alert('ファイルのアップロードに失敗しました。');
            return;
          }
        }

        const loading = $loading.open();
        try {
          const user = await trpc.profile.patchProfile.mutate({
            ...modelValue,
          });

          reset(user);

          $toast.success('データを保存しました。');
        } finally {
          loading.close();
        }
      })()
    "
  >
    <section class="flex flex-col gap-4 tablet:flex-row tablet:gap-8">
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
          <ErrorMessage class="text-xs text-red-600" for="username" />
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
          <ErrorMessage class="text-xs text-red-600" for="email" />
        </div>
      </div>
      <!-- 画像 -->
      <div class="flex flex-col items-center gap-4">
        <div>
          <MyImage
            :src-base="
              preview
                ? preview
                : modelValue.avatar_file_id
                ? `api/file/download/${modelValue.avatar_file_id}`
                : `https://dummyimage.com/256x256`
            "
            width="256"
            height="256"
            decoding="async"
            class="h-64 w-64 rounded object-cover object-center"
            alt="avatar"
          />
        </div>
        <MyButton
          v-if="modelValue.avatar_file_id"
          type="button"
          colorset="yellow"
          classset="text"
          class="w-64"
          secondary
          @click="
            async () => {
              if (
                modelValue.avatar_file_id &&
                (await $dialog.confirm('ファイルを削除しますか？\nこの操作は取り消せません。'))
              ) {
                await trpc.file.delete.mutate({ file_id: modelValue.avatar_file_id });
                // TODO リセットしないと変更があったように見えてしまう。しかし、 modelValue でリセットすると、変更していた状態も失う
                // => initailValue を呼べるようにするか、特定のプロパティだけリセットできるようにする
                modelValue.avatar_file_id = null;
              }
            }
          "
        >
          イメージを削除する
        </MyButton>
        <MyButton
          v-else
          type="button"
          colorset="white"
          classset="text"
          class="w-64"
          @click="
            async () => {
              file = await $modal.open<File>({
                component: MyInputFile,
                componentProps: { accept: 'image/*' },
                componentEvents: {},
              });
            }
          "
        >
          イメージを選ぶ
        </MyButton>
      </div>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!(isDirty || file)">
        登録
      </MyButton>
      <slot name="sub-button"></slot>
    </section>
  </form>
</template>
