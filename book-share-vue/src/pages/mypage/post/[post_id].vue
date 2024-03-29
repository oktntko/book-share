<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import FormPost, { type ModelPost } from '~/pages/mypage/post/components/FormPost.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const router = useRouter();
const route = useRoute();

const post_id = Number(route.params.post_id);
let updated_at = new Date();

const modelValue = ref<ModelPost>();
const volume = ref<RouterOutput['book']['getVolume']>();
const published = ref(false);

onMounted(async () => {
  const post = await trpc.post.getMyPost.query({ post_id });

  modelValue.value = post;
  volume.value = post.volume;
  published.value = post.published;
  updated_at = post.updated_at;
});

const toast = useToast();
const $loading = useLoading();
async function handleSubmit(value: ModelPost) {
  const loading = $loading.open();
  try {
    const _ = await trpc.post.update.mutate({
      ...value,
      post_id,
      updated_at,
    });

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
          to: `/mypage/post/${post_id}`,
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
            <MyButton
              type="button"
              classset="text"
              colorset="green"
              secondary
              @click="
                async () => {
                  if (await $dialog.confirm(`投稿を${published ? '非公開に' : '公開'}しますか？`)) {
                    const loading = $loading.open();
                    try {
                      const post = await trpc.post.publish.mutate({
                        post_id,
                        updated_at,
                        published: !published,
                      });

                      if (post.published) {
                        router.push(`/post/${post.post_id}`);
                        toast.success('投稿を公開しました。');
                      } else {
                        router.push(`/mypage/post`);
                        toast.success('投稿を非公開にました。');
                      }
                    } finally {
                      loading.close();
                    }
                  }
                }
              "
            >
              <Icon
                :icon="`${published ? 'bxs:lock' : 'bxs:lock-open-alt'}`"
                class="-ml-1 mr-2 h-5 w-5"
              >
              </Icon>
              {{ published ? '非公開にする' : '公開する' }}
            </MyButton>
            <MyButton
              type="button"
              classset="text"
              colorset="yellow"
              secondary
              @click="
                async () => {
                  if (await $dialog.confirm('データを削除しますか？\nこの操作は取り消せません。')) {
                    const loading = $loading.open();
                    try {
                      await trpc.post.delete.mutate({ post_id, updated_at });

                      router.replace(`/mypage/post`);

                      toast.success('データを削除しました。');
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
        </FormPost>
      </div>

      <MyPulseLoading v-else> </MyPulseLoading>
    </Transition>
  </div>
</template>
