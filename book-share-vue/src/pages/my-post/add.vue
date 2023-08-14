<script setup lang="ts">
import { trpc } from '~/middleware/trpc';
import FormPost, { type ModelPost } from '~/pages/my-post/components/FormPost.vue';
import { openLoading, openSuccessToast } from '~/utils/ProgrammaticComponentHelper';

const router = useRouter();

const modelValue = ref<ModelPost>({
  book_title: '',
  content: '',
  post_title: '',
  volume_id: '',
});

async function handleSubmit() {
  const loading = openLoading();
  try {
    const _ = await trpc.post.create.mutate(modelValue.value);

    router.replace(`/my-post`);

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
          label: '投稿一覧',
          to: '/my-post',
        },
        {
          label: '投稿を書く',
          to: '/my-post/add',
        },
      ]"
    >
    </MyBreadcrumb>

    <FormPost v-model="modelValue" class="container mx-auto my-4" @submit="handleSubmit"></FormPost>
  </div>
</template>
