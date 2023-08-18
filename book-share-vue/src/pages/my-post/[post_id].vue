<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import FormPost, { type ModelPost } from '~/pages/my-post/components/FormPost.vue';
import {
  openConfirmDialog,
  openLoading,
  openSuccessToast,
} from '~/utils/ProgrammaticComponentHelper';

const router = useRouter();
const route = useRoute();

const post_id = Number(route.params.post_id);
let updated_at = new Date();

const modelValue = ref<ModelPost>();
const volume = ref<RouterOutput['book']['getVolume']>();

onMounted(async () => {
  const post = await trpc.post.getMyPost.query({ post_id });

  modelValue.value = post;
  volume.value = post.volume;
  updated_at = post.updated_at;
});

async function handleSubmit(value: ModelPost) {
  const loading = openLoading();
  try {
    const _ = await trpc.post.update.mutate({
      ...value,
      post_id,
      updated_at,
    });

    router.replace(`/my-post`);

    openSuccessToast('データを保存しました。');
  } finally {
    loading.close();
  }
}

async function handleDelete() {
  if (await openConfirmDialog('データを削除しますか？\nこの操作は取り消せません。')) {
    const loading = openLoading();
    try {
      await trpc.post.delete.mutate({ post_id, updated_at });

      router.replace(`/my-post`);

      openSuccessToast('データを削除しました。');
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
      icon="uil:setting"
      :items="[
        {
          label: '投稿一覧',
          to: '/my-post',
        },
        {
          label: '投稿を書く',
          to: `/my-post/${post_id}`,
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
        <FormPost
          v-model="modelValue"
          v-model:volume="volume"
          class="container mx-auto my-4"
          @submit="handleSubmit"
        >
          <template #sub-button>
            <!-- TODO -->
            <!-- <button
              v-if="post_id"
              type="button"
              class="inline-flex min-w-[120px] justify-center rounded-lg border border-blue-800 bg-blue-100 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
              @click="handlePublish"
            >
              <Icon
                :icon="`${form.published ? 'bxs:lock' : 'bxs:lock-open-alt'}`"
                class="mr-2 -ml-1 h-5 w-5"
              >
              </Icon>
              {{ modelValue.published ? '非公開にする' : '公開する' }}
            </button> -->
            <MyButton
              type="button"
              classset="text"
              colorset="yellow"
              secondary
              @click="handleDelete"
            >
              削除
            </MyButton>
          </template>
        </FormPost>
      </div>

      <MyPulseLoading v-else> </MyPulseLoading>
    </Transition>
  </div>
</template>
