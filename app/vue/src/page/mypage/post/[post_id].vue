<script setup lang="ts">
useTitle('投稿を書く | BookShare');

import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';
import FormPost, { type ModelPost } from '~/page/mypage/post/component/FormPost.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const $router = useRouter();
const $route = useRoute('/mypage/post/[post_id]');

const post_id = Number($route.params.post_id);
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

const $toast = useToast();
const $loading = useLoading();
async function handleSubmit(value: ModelPost) {
  const loading = $loading.open();
  try {
    await trpc.post.update.mutate({
      ...value,
      post_id,
      updated_at,
    });

    $router.replace(`/mypage/post`);

    $toast.success('データを保存しました。');
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
        <template v-if="modelValue">
          <FormPost v-model="modelValue" v-model:volume="volume" @submit="handleSubmit">
            <template #sub-button>
              <MyButton
                type="button"
                classset="text"
                colorset="green"
                secondary
                @click="
                  async () => {
                    if (
                      await $dialog.confirm(`投稿を${published ? '非公開に' : '公開'}しますか？`)
                    ) {
                      const loading = $loading.open();
                      try {
                        const post = await trpc.post.publish.mutate({
                          post_id,
                          updated_at,
                          published: !published,
                        });

                        if (post.published) {
                          $router.push(`/post/${post.post_id}`);
                          $toast.success('投稿を公開しました。');
                        } else {
                          $router.push(`/mypage/post`);
                          $toast.success('投稿を非公開にました。');
                        }
                      } finally {
                        loading.close();
                      }
                    }
                  }
                "
              >
                <span
                  :class="published ? 'icon-[bxs--lock]' : 'icon-[bxs--lock-open-alt]'"
                  class="mr-2 -ml-1 h-5 w-5"
                >
                </span>
                {{ published ? '非公開にする' : '公開する' }}
              </MyButton>
              <MyButton
                type="button"
                classset="text"
                colorset="yellow"
                secondary
                @click="
                  async () => {
                    if (
                      await $dialog.confirm('データを削除しますか？\nこの操作は取り消せません。')
                    ) {
                      const loading = $loading.open();
                      try {
                        await trpc.post.delete.mutate({ post_id, updated_at });

                        $router.replace(`/mypage/post`);

                        $toast.success('データを削除しました。');
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
        </template>

        <MyLoading v-else> </MyLoading>
      </Transition>
    </div>
  </div>
</template>
