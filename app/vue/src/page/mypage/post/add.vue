<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';
import FormPost, { type ModelPost } from '~/page/mypage/post/component/FormPost.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const $router = useRouter();
const $route = useRoute('/mypage/post/add');

const modelValue = ref<ModelPost>({
  book_title: '',
  content: '',
  post_title: '',
  volume_id: '',
});
const volume = ref<RouterOutput['book']['getVolume']>();

onMounted(async () => {
  if ($route.query.volume_id && typeof $route.query.volume_id === 'string') {
    volume.value = await trpc.book.getVolume.query({ volume_id: $route.query.volume_id });
    modelValue.value.volume_id = $route.query.volume_id;
    modelValue.value.book_title = volume.value.volumeInfo?.title ?? '';
  }
});

const toast = useToast();
const $loading = useLoading();
async function handleSubmit() {
  const loading = $loading.open();
  try {
    await trpc.post.create.mutate(modelValue.value);

    $router.replace({ name: `/mypage/post/` });

    toast.success('データを保存しました。');
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="px-4 py-4 xl:container xl:mx-auto">
    <div class="flex flex-col gap-4">
      <MyBreadcrumb
        icon="icon-[uil--setting]"
        :items="[
          {
            label: 'マイページ',
            to: '/mypage/',
          },
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

      <FormPost v-model="modelValue" v-model:volume="volume" @submit="handleSubmit"></FormPost>
    </div>
  </div>
</template>
