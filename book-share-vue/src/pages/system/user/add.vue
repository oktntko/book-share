<script setup lang="ts">
import { trpc } from '~/middleware/trpc';
import FormUser, { type ModelUser } from '~/pages/system/user/components/FormUser.vue';
import { openLoading, openSuccessToast } from '~/utils/ProgrammaticComponentHelper';

const router = useRouter();

const modelValue = ref<ModelUser>({
  username: '',
  email: '',
  avatar_file_id: null,
});

async function handleSubmit() {
  const loading = openLoading();
  try {
    const user = await trpc.user.create.mutate(modelValue.value);

    router.replace(`/system/user/${user.user_id}`);

    openSuccessToast('データを保存しました。');
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="fa-solid:users"
      :items="[
        {
          label: 'ユーザ管理',
          to: '/system/user',
        },
        {
          label: 'ユーザ追加',
          to: '/system/user/add',
        },
      ]"
    >
    </MyBreadcrumb>

    <FormUser v-model="modelValue" class="container mx-auto my-4" @submit="handleSubmit"></FormUser>
  </div>
</template>
