<script setup lang="ts">
import { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import { trpc } from '~/middleware/trpc';
import { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';

const modelValue = ref<z.infer<typeof ProfileRouterSchema.patchPasswordInput>>({
  current_password: '',
  new_password: '',
  confirm: '',
});

const { validateSubmit, ErrorMessage, isDirty, reset } = useValidate(
  ProfileRouterSchema.patchPasswordInput,
  modelValue,
);
</script>

<template>
  <form
    class="flex flex-col gap-4"
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
      <ErrorMessage class="text-xs text-red-600" for="current_password" />
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
      <ErrorMessage class="text-xs text-red-600" for="new_password" />
    </div>

    <div>
      <label for="confirm" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
        (確認用)もう一度パスワードを入力してください
      </label>
      <input
        id="confirm"
        v-model.lazy="modelValue.confirm"
        autocomplete="new-password"
        type="password"
        class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
        required
      />
      <ErrorMessage class="text-xs text-red-600" for="confirm" />
    </div>
    <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty"> 変更 </MyButton>
  </form>
</template>
