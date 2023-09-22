<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import FormProfile from './components/FormProfile.vue';
import FormAvatarFile from './components/FormAvatarFile.vue';
import FormPassword from './components/FormPassword.vue';

const modelValue = ref<RouterOutput['profile']['get']>();

onMounted(async () => {
  const user = await trpc.profile.get.query();

  modelValue.value = user;
});
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="uil:setting"
      :items="[
        {
          label: 'プロフィール編集',
          to: '/mypage/profile',
        },
      ]"
    >
    </MyBreadcrumb>

    <Transition
      enter-from-class="transform opacity-0"
      enter-active-class="ease-out duration-500"
      enter-to-class="transform opacity-100"
    >
      <section v-if="modelValue" class="container mx-auto my-4">
        <section class="mx-auto my-4 flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-5xl">
          <section class="flex flex-col gap-4 tablet:flex-row tablet:gap-8">
            <!-- ユーザ名・メールアドレス -->
            <FormProfile v-model="modelValue" class="grow"> </FormProfile>
            <!-- 画像 -->
            <FormAvatarFile v-model="modelValue"> </FormAvatarFile>
          </section>
        </section>
        <!-- パスワード変更 -->
        <FormPassword class="mx-auto my-4 flex flex-col gap-4 laptop:max-w-3xl desktop:max-w-5xl">
        </FormPassword>
        <!-- 削除 -->
        <!-- <template #sub-button>
          <MyButton type="button" classset="text" colorset="yellow" secondary @click="handleDelete">
            削除
          </MyButton>
        </template> -->
      </section>
      <MyPulseLoading v-else> </MyPulseLoading>
    </Transition>
  </div>
</template>
