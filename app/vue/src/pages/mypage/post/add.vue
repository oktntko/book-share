<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import FormPost, { type ModelPost } from '~/pages/mypage/post/components/FormPost.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const router = useRouter();
const route = useRoute();

const modelValue = ref<ModelPost>({
  book_title: '',
  content: '',
  post_title: '',
  volume_id: '',
});
const volume = ref<RouterOutput['book']['getVolume']>();

onMounted(async () => {
  if (route.query.volume_id && typeof route.query.volume_id === 'string') {
    volume.value = await trpc.book.getVolume.query({ volume_id: route.query.volume_id });
    modelValue.value.volume_id = route.query.volume_id;
    modelValue.value.book_title = volume.value.volumeInfo?.title ?? '';
  }
});

const toast = useToast();
const $loading = useLoading();
async function handleSubmit() {
  const loading = $loading.open();
  try {
    const _ = await trpc.post.create.mutate(modelValue.value);

    router.replace(`/mypage/post`);

    toast.success('データを保存しました。');
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
          to: '/mypage/post',
        },
        {
          label: '投稿を書く',
          to: '/mypage/post/add',
        },
      ]"
    >
    </MyBreadcrumb>

    <FormPost
      v-model="modelValue"
      v-model:volume="volume"
      class="container mx-auto my-4"
      @submit="handleSubmit"
    ></FormPost>
  </div>
</template>
