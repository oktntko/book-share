<script setup lang="ts">
import { dayjs } from '@book-share/lib/dayjs';
import type { RouterOutput } from '~/lib/trpc';

const emit = defineEmits<{
  select: [post: RouterOutput['post']['getMyPostList']['post_list'][number]];
  edit: [post: RouterOutput['post']['getMyPostList']['post_list'][number]];
  delete: [post: RouterOutput['post']['getMyPostList']['post_list'][number]];
}>();

defineProps<{
  post: RouterOutput['post']['getMyPostList']['post_list'][number];
}>();

const showMenu = ref(false);
</script>

<template>
  <a
    class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 bg-white p-4 transition-colors hover:bg-blue-100"
    @click.prevent="
      () => {
        emit('select', post);
      }
    "
  >
    <!-- サムネイル -->
    <div class="flex shrink-0 items-center justify-center">
      <img
        :title="post.volume?.volumeInfo?.title ?? ''"
        :alt="post.volume?.volumeInfo?.title ?? ''"
        class="h-24 w-16 rounded object-cover object-center"
        :src="post.volume?.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/64x96'"
        height="96"
        width="64"
        decoding="async"
      />
    </div>

    <div class="flex grow flex-col gap-2">
      <div class="flex justify-between">
        <div class="line-clamp-1 text-xs text-gray-400">
          {{ post.volume?.volumeInfo?.title ?? '(本未選択)' }}
        </div>
        <div class="relative inline-block text-left">
          <OnClickOutside
            class="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
            @trigger="() => (showMenu = false)"
          >
            <MyButton type="button" classset="icon" colorset="white" @click="showMenu = !showMenu">
              <span class="icon-[solar--menu-dots-bold]"></span>
            </MyButton>
          </OnClickOutside>

          <Transition
            enter-from-class="transform opacity-0 scale-95"
            enter-active-class="transition ease-out duration-100"
            enter-to-class="transform opacity-100 scale-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-show="showMenu"
              class="ring-opacity-5 absolute right-0 z-50 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-black focus:outline-none"
              tabindex="-1"
            >
              <a
                class="block cursor-pointer rounded-t-md border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                @click="emit('edit', post)"
              >
                編集する
              </a>
              <a
                class="block cursor-pointer rounded-b-md border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                @click="emit('delete', post)"
              >
                削除する
              </a>
            </div>
          </Transition>
        </div>
      </div>
      <div class="line-clamp-2 grow text-lg text-gray-900">
        {{ `${post.post_title ? post.post_title : '(タイトル未設定)'}` }}
      </div>
      <div class="flex flex-row items-center gap-2 text-xs text-gray-400">
        <!-- slot -->
        <div class="inline-flex shrink-0 flex-row gap-2">
          <div
            class="leading-sm inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase"
            :class="[post.published ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700']"
          >
            <span
              class="mr-1 h-4 w-4"
              :class="[post.published ? 'icon-[bxs--lock-open-alt]' : 'icon-[bxs--lock]']"
            >
            </span>
            {{ post.published ? '公開中' : '下書き' }}
          </div>
        </div>
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
  </a>
</template>
