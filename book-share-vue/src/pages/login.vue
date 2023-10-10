<route lang="yaml">
meta:
  layout: empty
</route>

<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import { trpc } from '~/middleware/trpc';
import { AuthRouterSchema } from '~/schema/AuthRouterSchema';
import ModalSigninTwofa from './components/ModalSigninTwofa.vue';
import type { RouterOutput } from '~/lib/trpc';

const router = useRouter();

const modelValue = ref<z.infer<typeof AuthRouterSchema.signinInput>>({
  email: 'example@example.com',
  password: '',
});

const { validateSubmit, ErrorMessage } = useValidate(AuthRouterSchema.signinInput, modelValue);
</script>

<template>
  <div class="bg-gray-50">
    <div class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
      <!-- タイトル -->
      <h1 class="mb-6 flex items-center text-2xl font-semibold text-gray-900">
        <Icon icon="noto-v1:books" class="ml-[-16px] h-10 w-10 rounded-full p-2 text-white"> </Icon>
        <span class="text-xl">Book Share</span>
      </h1>

      <!-- ボックス -->
      <div
        class="w-full rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-md sm:max-w-md sm:p-8 md:mt-0"
      >
        <form
          class="flex flex-col gap-8"
          @submit.prevent="
            validateSubmit(async () => {
              const loading = $loading.open();
              try {
                const { auth } = await trpc.auth.signin.mutate(modelValue);

                if (auth) {
                  router.push({ name: 'index' });
                } else {
                  const result = await $modal.open<RouterOutput['auth']['signinTwofa']>({
                    component: ModalSigninTwofa,
                    componentProps: {},
                    componentEvents: {},
                  });

                  if (result) {
                    router.push({ name: 'index' });
                  }
                }
              } finally {
                loading.close();
              }
            })()
          "
        >
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
              <ErrorMessage class="text-xs text-red-600" for="email"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-1">
              <label for="password" class="text-sm font-medium text-gray-900"> パスワード </label>
              <InputPassword
                id="password"
                v-model.lazy="modelValue.password"
                required
                class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              />
              <ErrorMessage class="text-xs text-red-600" for="email"></ErrorMessage>
            </div>
          </section>

          <section>
            <MyButton class="w-full" type="submit" classset="text" colorset="green">
              ログイン
            </MyButton>
          </section>
        </form>

        <section class="mt-8 flex flex-col items-end">
          <div class="text-sm font-light text-gray-500">
            <RouterLink to="#" class="text-primary-600 font-medium text-blue-600 hover:underline">
              パスワードを忘れてしまった
            </RouterLink>
          </div>
          <div class="text-sm font-light text-gray-500">
            <RouterLink
              to="/signup"
              class="text-primary-600 font-medium text-blue-600 hover:underline"
            >
              アカウントを作る
            </RouterLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
