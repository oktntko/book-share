<route lang="yaml">
meta:
  layout: empty
</route>

<script setup lang="ts">
useTitle('新規登録 | BookShare');

import { AuthRouterSchema } from '@book-share/express/schema';
import type { z } from '@book-share/lib/zod';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import { trpc } from '~/lib/trpc';
import { useLoading } from '~/plugin/LoadingPlugin';

const $router = useRouter();

const modelValue = ref<z.infer<typeof AuthRouterSchema.signupInput>>({
  email: 'example@example.com',
  new_password: '',
  confirm: '',
});

const { validateSubmit, ErrorMessage } = useVueValidateZod(
  AuthRouterSchema.signupInput,
  modelValue,
);

const $loading = useLoading();
const handleSubmit = validateSubmit(async () => {
  const loading = $loading.open();
  try {
    await trpc.auth.signup.mutate(modelValue.value);

    $router.push({ name: '/' });
  } finally {
    loading.close();
  }
});
</script>

<template>
  <div class="bg-gray-50">
    <div class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
      <!-- タイトル -->
      <h1 class="mb-6 flex items-center text-2xl font-semibold text-gray-900">
        <span class="icon-[noto-v1--books] ml-[-16px] h-10 w-10 rounded-full p-2 text-white">
        </span>
        <span class="ml-2 text-xl">Book Share</span>
      </h1>

      <!-- ボックス -->
      <div
        class="w-full rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-md sm:max-w-md sm:p-8 md:mt-0"
      >
        <form class="flex flex-col gap-8" @submit.prevent="handleSubmit">
          <section class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="email" class="text-sm font-medium text-gray-900"> メールアドレス </label>
              <input
                id="email"
                v-model.lazy="modelValue.email"
                type="email"
                required
                class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
                autocomplete="username"
              />
              <ErrorMessage class="text-xs text-red-600" field="email"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-1">
              <label for="new_password" class="text-sm font-medium text-gray-900">
                パスワード
              </label>
              <InputPassword
                id="new_password"
                v-model.lazy="modelValue.new_password"
                required
                class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
                autocomplete="new-password"
              />
              <ErrorMessage class="text-xs text-red-600" field="new_password"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-1">
              <label for="confirm" class="text-sm font-medium text-gray-900">
                (確認用)もう一度パスワードを入力してください
              </label>
              <input
                id="confirm"
                v-model.lazy="modelValue.confirm"
                type="password"
                required
                class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              />
              <ErrorMessage class="text-xs text-red-600" field="confirm"></ErrorMessage>
            </div>
          </section>

          <section>
            <MyButton class="w-full" type="submit" classset="text" colorset="green">
              登録
            </MyButton>
          </section>
        </form>

        <section class="mt-8 flex flex-col items-end">
          <div class="text-sm font-light text-gray-500">
            アカウントを持っていますか？
            <RouterLink
              to="/login"
              class="text-primary-600 font-medium text-blue-600 hover:underline"
            >
              ログインする
            </RouterLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
