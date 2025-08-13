<script setup lang="ts">
import { dayjs } from '@book-share/lib/dayjs';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';
import ViewBook from '../component/ViewBook.vue';

const $route = useRoute('/post/[post_id]');

const post_id = Number($route.params.post_id);

const post = ref<RouterOutput['post']['get']>(await trpc.post.get.query({ post_id }));
</script>

<template>
  <div class="flex flex-col gap-8 px-4 py-4 lg:flex-row xl:container xl:mx-auto">
    <!-- 左 -->
    <div class="top-4 w-full shrink-0 self-start lg:sticky lg:w-64 xl:w-80">
      <div v-if="post.volume" class="relative">
        <ViewBook class="rounded border bg-gray-100" :volume="post.volume" :hoverable="false">
        </ViewBook>
      </div>
      <div class="flex flex-col gap-2 py-4">この本の他の投稿</div>
    </div>

    <!-- 真ん中 -->
    <div class="flex grow flex-col justify-start gap-4">
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
              (post.updated_at.getTime() - post.published_at.getTime()) / (1000 * 60 * 60 * 24) > 1
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
