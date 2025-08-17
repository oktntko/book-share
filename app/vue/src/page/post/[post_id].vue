<script setup lang="ts">
const title = useTitle('投稿を読む | BookShare');

import { dayjs } from '@book-share/lib/dayjs';
import { onBeforeRouteUpdate } from 'vue-router/auto';
import type QuillEditor from '~/component/QuillEditor.vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';
import ViewBook from '../component/ViewBook.vue';

const $route = useRoute('/post/[post_id]');

const post = ref<RouterOutput['post']['get']>();

const refQuillEditor = useTemplateRef<typeof QuillEditor>('refQuillEditor');

onMounted(() => {
  refresh(Number($route.params.post_id));
});

async function refresh(post_id: number) {
  post.value = undefined;
  post.value = await trpc.post.get.query({ post_id });
  title.value = `${post.value.post_title} | BookShare`;
  refQuillEditor.value?.setContents(post.value.content);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onBeforeRouteUpdate(async (to) => {
  await refresh(Number((to.params as typeof $route.params).post_id));
});
</script>

<template>
  <div class="flex flex-col gap-8 px-4 py-4 lg:flex-row xl:container xl:mx-auto">
    <!-- 左 -->
    <div class="top-4 w-full shrink-0 self-start lg:sticky lg:w-64 xl:w-80">
      <template v-if="post?.volume">
        <div class="relative">
          <ViewBook class="rounded border bg-gray-100" :volume="post.volume" :hoverable="false">
          </ViewBook>
        </div>

        <div class="flex flex-col gap-2 pt-4 pb-2">この本の他の投稿</div>

        <div class="flex flex-col gap-1">
          <RouterLink
            v-for="rPost of post.related_post_list"
            :key="rPost.post_id"
            :to="{
              name: `/post/[post_id]`,
              params: {
                post_id: rPost.post_id,
              },
            }"
            class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-blue-100"
          >
            <div class="flex grow flex-col gap-2">
              <div class="line-clamp-2 grow text-lg text-gray-900">
                {{ `${rPost.post_title ? rPost.post_title : '(タイトル未設定)'}` }}
              </div>
              <div class="flex flex-row items-center gap-2 text-xs text-gray-400">
                <img
                  v-if="rPost.toukousya.avatar_image"
                  :src="rPost.toukousya.avatar_image"
                  width="24"
                  height="24"
                  decoding="async"
                  class="h-6 w-6 rounded-full object-cover object-center"
                  alt="avatar"
                />
                <span
                  v-else
                  class="icon-[clarity--avatar-solid] h-6 w-6 rounded-full object-cover object-center"
                ></span>
                <div>
                  {{ rPost.toukousya.username }}
                </div>
                <div>
                  <span>
                    {{ dayjs.duration(dayjs(rPost.published_at).diff(dayjs())).humanize(true) }}
                  </span>
                </div>
                <div
                  v-if="
                    rPost.published_at &&
                    (rPost.updated_at.getTime() - rPost.published_at.getTime()) /
                      (1000 * 60 * 60 * 24) >
                      1
                  "
                >
                  最終更新
                  <span>
                    {{ dayjs.duration(dayjs(rPost.updated_at).diff(dayjs())).humanize(true) }}
                  </span>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </template>
    </div>

    <!-- 真ん中 -->
    <div class="flex grow flex-col justify-start gap-4">
      <template v-if="post">
        <div>
          <div class="p-8 text-center text-2xl/relaxed font-bold">
            {{ post.post_title }}
          </div>

          <div class="flex items-center justify-end gap-1">
            <div>
              <span>
                {{ dayjs.duration(dayjs(post.published_at).diff(dayjs())).humanize(true) }}
              </span>
            </div>
            <div
              v-if="
                post.published_at &&
                (post.updated_at.getTime() - post.published_at.getTime()) / (1000 * 60 * 60 * 24) >
                  1
              "
            >
              最終更新
              <span>
                {{ dayjs.duration(dayjs(post.updated_at).diff(dayjs())).humanize(true) }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <QuillEditor
            v-show="post"
            v-model="post.content"
            :options="{
              readOnly: true,
              theme: 'snow',
              modules: {
                toolbar: false,
              },
            }"
            class="rounded bg-white"
          >
          </QuillEditor>
        </div>
      </template>
    </div>

    <!-- 右 -->
    <div class="top-4 flex w-48 shrink-0 flex-col gap-4 self-start lg:sticky xl:w-64">
      <div class="table h-32 w-48 border border-gray-200 bg-stone-300 p-4 xl:h-48 xl:w-64">
        <span class="table-cell text-center align-middle text-2xl text-gray-400">広告スペース</span>
      </div>
      <div class="table h-32 w-48 border border-gray-200 bg-stone-300 p-4 xl:h-48 xl:w-64">
        <span class="table-cell text-center align-middle text-2xl text-gray-400">広告スペース</span>
      </div>
    </div>
  </div>
</template>
