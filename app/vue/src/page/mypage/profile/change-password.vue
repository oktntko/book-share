<script setup lang="ts">
import { ProfileRouterSchema } from '@book-share/express/schema';
import { z } from '@book-share/lib/zod';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import { trpc } from '~/lib/trpc';

const modelValue = ref<z.infer<typeof ProfileRouterSchema.patchPasswordInput>>({
  current_password: '',
  new_password: '',
  confirm: '',
});

const { validateSubmit, ErrorMessage, isDirty, reset } = useVueValidateZod(
  ProfileRouterSchema.patchPasswordInput,
  modelValue,
);
</script>

<template>
  <form
    class="flex flex-col gap-8 lg:max-w-3xl xl:max-w-4xl"
    autocomplete="off"
    @submit.prevent="
      validateSubmit(async () => {
        const loading = $loading.open();
        try {
          await trpc.profile.patchPassword.mutate(modelValue);

          reset({
            current_password: '',
            new_password: '',
            confirm: '',
          });

          $toast.success('データを保存しました。');
        } finally {
          loading.close();
        }
      })()
    "
  >
    <section class="flex flex-col gap-4">
      <div>
        <label
          for="current_password"
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
        >
          現在のパスワード
        </label>
        <input
          id="current_password"
          v-model.lazy="modelValue.current_password"
          type="text"
          class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          autocomplete="current-password"
        />
        <ErrorMessage class="text-xs text-red-600" field="current_password" />
      </div>

      <div>
        <label
          for="new_password"
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
        >
          新しいパスワード
        </label>
        <InputPassword
          id="new_password"
          v-model.lazy="modelValue.new_password"
          class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          required
          autocomplete="new-password"
        />
        <ErrorMessage class="text-xs text-red-600" field="new_password" />
      </div>

      <div>
        <label for="confirm" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          (確認用)もう一度パスワードを入力してください
        </label>
        <input
          id="confirm"
          v-model.lazy="modelValue.confirm"
          type="password"
          class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          required
          autocomplete="new-password"
        />
        <ErrorMessage class="text-xs text-red-600" field="confirm" />
      </div>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty">
        変更
      </MyButton>
    </section>
  </form>
</template>
