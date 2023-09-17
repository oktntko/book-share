<script setup lang="ts">
import { trpc } from '~/middleware/trpc';
import FormUser, {
  type ModelUser,
  type ResetUser,
} from '~/pages/system/user/components/FormUser.vue';
import { useDialog } from '~/plugin/DialogPlugin';
import { useToast } from '~/plugin/ToastPlugin';
import { openLoading } from '~/utils/ProgrammaticComponentHelper';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const user_id = Number(route.params.user_id);
const updated_at = ref(new Date());
const modelValue = ref<ModelUser>();

onMounted(async () => {
  const user = await trpc.user.get.query({ user_id });

  modelValue.value = user;
  updated_at.value = user.updated_at;
});

async function handleSubmit(modelValue: Ref<ModelUser>, reset: ResetUser) {
  const loading = openLoading();
  try {
    const user = await trpc.user.update.mutate({
      ...modelValue.value,
      user_id,
      updated_at: updated_at.value,
    });

    reset(user);
    updated_at.value = user.updated_at;

    toast.success('データを保存しました。');
  } finally {
    loading.close();
  }
}

const dialog = useDialog();
async function handleDelete() {
  if (await dialog.confirm('データを削除しますか？\nこの操作は取り消せません。')) {
    const loading = openLoading();
    try {
      await trpc.user.delete.mutate({ user_id, updated_at: updated_at.value });

      router.replace(`/system/user`);

      toast.success('データを削除しました。');
    } finally {
      loading.close();
    }
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
          label: 'ユーザ詳細',
          to: `/system/user/${user_id}`,
        },
      ]"
    >
    </MyBreadcrumb>

    <Transition
      enter-from-class="transform opacity-0"
      enter-active-class="ease-out duration-500"
      enter-to-class="transform opacity-100"
    >
      <FormUser
        v-if="modelValue"
        v-model="modelValue"
        class="container mx-auto my-4"
        @submit="handleSubmit"
      >
        <template #sub-button>
          <MyButton type="button" classset="text" colorset="yellow" secondary @click="handleDelete">
            削除
          </MyButton>
        </template>
      </FormUser>
      <MyPulseLoading v-else> </MyPulseLoading>
    </Transition>
  </div>
</template>
