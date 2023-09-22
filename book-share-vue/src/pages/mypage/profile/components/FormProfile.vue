<script setup lang="ts">
import { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import { trpc } from '~/middleware/trpc';
import { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';

const modelValue = defineModel<z.infer<typeof ProfileRouterSchema.patchProfileInput>>({
  required: true,
});

const { validateSubmit, ErrorMessage, isDirty, reset } = useValidate(
  ProfileRouterSchema.patchProfileInput,
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
          const { username, email } = await trpc.profile.patchProfile.mutate(modelValue);

          reset({ ...modelValue, username, email });

          $toast.success('データを保存しました。');
        } finally {
          loading.close();
        }
      })()
    "
  >
    <div>
      <label for="username" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
        名前
      </label>
      <input
        id="username"
        v-model.lazy="modelValue.username"
        type="text"
        class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
        maxlength="100"
      />
      <ErrorMessage class="text-xs text-red-600" for="username" />
    </div>

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

    <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty"> 保存 </MyButton>
  </form>
</template>
