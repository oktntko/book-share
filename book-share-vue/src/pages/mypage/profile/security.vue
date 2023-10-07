<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import { trpc } from '~/middleware/trpc';
import { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';
import type { RouterOutput } from '~/lib/trpc';

const user = await trpc.profile.get.query();

const modelValue = ref<z.infer<typeof ProfileRouterSchema.enableSecretInput>>({
  token: '',
});

const { validateSubmit, ErrorMessage, isDirty, reset } = useValidate(
  ProfileRouterSchema.enableSecretInput,
  modelValue,
);

const qrcode = ref<RouterOutput['profile']['generateSecret']>({
  dataurl: '',
});
</script>

<template>
  <div class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl">
    <!-- 二要素認証が有効の場合 -->
    <section v-if="user.twofa_enable" class="mb-4">
      <div
        class="flex flex-col gap-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300"
        role="alert"
      >
        <div class="flex items-center gap-4">
          <span class="sr-only">Info</span>
          <Icon icon="wpf:security-checked" class="h-32 w-32 text-green-400"> </Icon>
          <h3 class="text-lg font-medium text-blue-900">二要素認証が有効です。</h3>
        </div>
        <div class="flex justify-end">
          <MyButton
            type="button"
            classset="text"
            colorset="red"
            secondary
            @click="
              async () => {
                if (await $dialog.confirm('二要素認証を無効化しますか？')) {
                  await trpc.profile.disableSecret.mutate();
                  user.twofa_enable = false;
                }
              }
            "
          >
            <Icon icon="akar-icons:circle-x-fill" class="-ml-1 mr-2 h-4 w-4"></Icon>
            無効化する
          </MyButton>
        </div>
      </div>
    </section>

    <section v-else class="mb-4">
      <div
        class="flex flex-col gap-4 border-t-2 border-yellow-300 bg-yellow-50 p-4 dark:bg-yellow-300"
        role="alert"
      >
        <div class="flex items-center gap-4">
          <span class="sr-only">Info</span>
          <Icon icon="fluent-emoji-flat:light-bulb" class="h-32 w-32"> </Icon>
          <div>
            <h3 class="text-lg font-medium text-yellow-900">二要素認証が有効になっていません。</h3>
            <button
              type="button"
              class="inline-flex items-center justify-center px-4 py-2 text-sm text-gray-700 transition-colors hover:text-blue-600"
              @click="
                async () => {
                  qrcode = await trpc.profile.generateSecret.mutate();
                }
              "
            >
              <Icon icon="wpf:security-checked" class="-ml-1 mr-2 h-4 w-4 text-green-400"></Icon>
              有効化の設定を開始する
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 有効化フォーム -->
    <section v-if="qrcode.dataurl" class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <div class="flex items-center space-x-2.5">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-600"
          >
            1
          </span>
          <div>
            <h3 class="font-medium leading-tight">
              AuthenticatorアプリでQRコードをスキャンしてください。
            </h3>
            <p class="text-sm text-gray-400">
              Authenticatorアプリは
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                target="_blank"
                rel="noopener noreferrer"
                class="cursor-pointer hover:text-blue-600"
              >
                Google Authenticator
              </a>
              や
              <a
                href="https://play.google.com/store/apps/details?id=com.azure.authenticator"
                target="_blank"
                rel="noopener noreferrer"
                class="cursor-pointer hover:text-blue-600"
              >
                Microsoft Authenticator
              </a>
              が人気です。
            </p>
          </div>
        </div>

        <img :src="qrcode.dataurl" width="128" height="128" decoding="async" />
      </div>

      <form
        class="flex flex-col gap-4"
        autocomplete="off"
        @submit.prevent="
          validateSubmit(async () => {
            const loading = $loading.open();
            try {
              await trpc.profile.enableSecret.mutate({
                ...modelValue,
              });

              $toast.success('データを保存しました。');
            } finally {
              loading.close();
            }
          })()
        "
      >
        <div class="flex items-center space-x-2.5">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-600"
          >
            2
          </span>
          <div>
            <h3 class="font-medium leading-tight">コードを検証します。</h3>
            <p class="text-sm text-gray-400">
              Authenticatorアプリに表示される6桁の数字を入力してください。
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="modelValue.token"
            placeholder=""
            type="text"
            pattern="\d{6}"
            class="block w-24 rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
            maxlength="6"
          />
          <span class="text-xs text-gray-400"> {{ modelValue.token.length }}/6 桁 </span>
        </div>

        <section class="flex gap-4">
          <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty">
            コードを検証し二要素認証を有効化する
          </MyButton>
          <slot name="sub-button"></slot>
        </section>
      </form>
    </section>
  </div>
</template>
