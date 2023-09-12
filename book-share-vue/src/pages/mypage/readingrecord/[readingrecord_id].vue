<script setup lang="ts">
import { trpc } from '~/middleware/trpc';
import { type ModelReadingrecord } from '~/pages/mypage/readingrecord/components/FormReadingrecord.vue';
import {
  openConfirmDialog,
  openLoading,
  openSuccessToast,
} from '~/utils/ProgrammaticComponentHelper';

const router = useRouter();
const route = useRoute();

const readingrecord_id = Number(route.params.readingrecord_id);
let updated_at = new Date();

const modelValue = ref<ModelReadingrecord>();

onMounted(async () => {
  const post = await trpc.readingrecord.get.query({ readingrecord_id });

  modelValue.value = post;
  updated_at = post.updated_at;
});

async function handleSubmit(value: ModelReadingrecord) {
  const loading = openLoading();
  try {
    const _ = await trpc.readingrecord.update.mutate({
      ...value,
      readingrecord_id,
      updated_at,
    });

    router.replace(`/mypage/readingrecord`);

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
      icon="uil:setting"
      :items="[
        {
          label: '読んだ本',
          to: '/mypage/readingrecord',
        },
        {
          label: `${modelValue?.book_title ?? ''}`,
          to: `/mypage/readingrecord/${readingrecord_id}`,
        },
      ]"
    >
    </MyBreadcrumb>

    <Transition
      mode="out-in"
      enter-from-class="transform opacity-0"
      enter-active-class="transition ease-out duration-200"
      enter-to-class="transform opacity-100"
    >
      <div v-if="modelValue">
        <FormReadingrecord
          v-model="modelValue"
          class="container mx-auto my-4"
          @submit="handleSubmit"
        >
          <template #sub-button>
            <MyButton
              type="button"
              classset="text"
              colorset="yellow"
              secondary
              @click="
                async () => {
                  if (
                    await openConfirmDialog('データを削除しますか？\nこの操作は取り消せません。')
                  ) {
                    const loading = openLoading();
                    try {
                      await trpc.readingrecord.delete.mutate({ readingrecord_id, updated_at });

                      router.replace(`/mypage/readingrecord`);

                      openSuccessToast('データを削除しました。');
                    } finally {
                      loading.close();
                    }
                  }
                }
              "
            >
              削除
            </MyButton>
          </template>
        </FormReadingrecord>
      </div>

      <MyPulseLoading v-else> </MyPulseLoading>
    </Transition>
  </div>
</template>
