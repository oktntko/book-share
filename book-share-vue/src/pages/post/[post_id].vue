<script setup lang="ts">
const title = useTitle('投稿を読む | BookShare');

import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import Editor from '~/pages/components/Editor.vue';

const route = useRoute();

const post = ref<RouterOutput['public']['post']['get']>();

onMounted(async () => {
  refresh(Number(route.params.post_id));
});

async function refresh(post_id: number) {
  post.value = undefined;
  post.value = await trpc.public.post.get.query({ post_id });
  title.value = `${post.value.post_title} | BookShare`;
}

onBeforeRouteUpdate(async (to) => {
  await refresh(Number(to.params.post_id));
});
</script>

<template>
  <Transition
    mode="out-in"
    enter-from-class="transform opacity-0"
    enter-active-class="transition ease-out duration-200"
    enter-to-class="transform opacity-100"
  >
    <div v-if="post" class="container mx-auto mb-8 flex gap-8 p-4">
      <div class="flex w-80 shrink-0 flex-col gap-8 py-4">
        <!-- 本の情報 -->
        <div v-if="post.volume" class="flex flex-col gap-4 rounded border bg-white p-4">
          <div class="flex flex-col gap-2">
            <!-- 本の情報 -->
            <div class="flex gap-4">
              <!-- サムネイル -->
              <div class="flex shrink-0 flex-col">
                <div class="relative mx-auto inline">
                  <img
                    :title="post.volume.volumeInfo?.title ?? ''"
                    :alt="post.volume.volumeInfo?.title ?? ''"
                    class="relative z-10 h-[94px] w-[64px] rounded object-cover object-center"
                    :src="
                      post.volume.volumeInfo?.imageLinks?.thumbnail ??
                      'https://dummyimage.com/64x94'
                    "
                    height="94"
                    width="64"
                    decoding="async"
                  />
                  <img
                    :title="post.volume.volumeInfo?.title ?? ''"
                    :alt="post.volume.volumeInfo?.title ?? ''"
                    class="absolute -bottom-1 left-1 z-[9] h-[94px] w-[64px] object-cover object-center opacity-80 blur"
                    :src="
                      post.volume.volumeInfo?.imageLinks?.thumbnail ??
                      'https://dummyimage.com/64x94'
                    "
                    height="94"
                    width="64"
                    decoding="async"
                  />
                </div>
              </div>
              <!-- 右側 -->
              <div v-if="post.volume.volumeInfo" class="flex flex-col gap-1 text-gray-900">
                <h3
                  v-if="post.volume.volumeInfo?.authors"
                  class="text-xs text-blue-500 transition-colors"
                >
                  {{ post.volume.volumeInfo?.authors.join(', ') }}
                </h3>
                <h2 v-if="post.volume.volumeInfo?.title" class="line-clamp-2 text-lg font-bold">
                  {{ post.volume.volumeInfo?.title }}
                </h2>
                <h2 v-if="post.volume.volumeInfo?.subtitle" class="text-sm text-gray-600">
                  {{ post.volume.volumeInfo?.subtitle }}
                </h2>
                <span v-if="post.volume.volumeInfo?.publishedDate" class="text-xs text-gray-600">
                  {{ post.volume.volumeInfo?.publishedDate }}
                </span>
                <span v-if="post.volume.volumeInfo?.publisher" class="text-xs text-gray-600">
                  {{ post.volume.volumeInfo?.publisher }}
                </span>
              </div>
            </div>

            <div
              class="line-clamp-4 text-sm leading-relaxed"
              :title="post.volume.volumeInfo?.description ?? ''"
            >
              {{ post.volume.volumeInfo?.description }}
            </div>
            <footer class="flex flex-wrap items-start justify-start gap-2">
              <a
                v-if="post.volume?.volumeInfo?.infoLink"
                :href="post.volume.volumeInfo.infoLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium !text-blue-500 shadow-sm transition-all hover:bg-gray-200 hover:underline focus:outline-none focus:ring"
                @click.stop
              >
                <Icon icon="bi:google-play" class="mr-1"></Icon>
                Google Books
              </a>
              <a
                v-if="post.volume?.volumeInfo?.previewLink"
                :href="post.volume.volumeInfo.previewLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium !text-blue-500 shadow-sm transition-all hover:bg-gray-200 hover:underline focus:outline-none focus:ring"
                @click.stop
              >
                <Icon icon="fluent-emoji-high-contrast:free-button" class="mr-1"></Icon>
                無料サンプル
              </a>
            </footer>
          </div>

          <hr />

          <!-- 同じ本の他の投稿 -->
          <div class="flex flex-col gap-1">
            <RouterLink
              v-for="r of post.related_post_list"
              :key="r.post_id"
              :class="['flex gap-2', 'cursor-pointer transition-colors hover:text-blue-600']"
              :to="`/post/${r.post_id}`"
            >
              <div class="flex shrink-0 items-center justify-between">
                <MyImage
                  :src-base="
                    post.toukousya.avatar_file_id
                      ? `api/file/download/${post.toukousya.avatar_file_id}`
                      : `https://dummyimage.com/32x32`
                  "
                  width="32"
                  height="32"
                  decoding="async"
                  class="h-8 w-8 rounded-full object-cover object-center"
                  alt="avatar"
                />
              </div>
              <div>
                <p class="line-clamp-2 text-sm">{{ r.post_title }}</p>
                <p class="text-xs text-gray-500">{{ post.toukousya.username }}</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="flex grow flex-col justify-start gap-4">
        <p class="mt-2 line-clamp-2 text-2xl font-bold" :title="post.post_title">
          {{ post.post_title }}
        </p>
        <div class="flex grow flex-col justify-start gap-4">
          <Editor v-show="post" v-model="post.content" :editable="false"> </Editor>
        </div>

        <!-- 投稿者の情報 -->
        <div class="flex flex-col gap-4 rounded border bg-white p-4">
          <div class="flex flex-col gap-2">
            <div class="flex gap-4">
              <!-- サムネイル -->
              <div class="flex shrink-0 flex-col">
                <div class="relative mx-auto inline">
                  <MyImage
                    :src-base="
                      post.toukousya.avatar_file_id
                        ? `api/file/download/${post.toukousya.avatar_file_id}`
                        : `https://dummyimage.com/256x256`
                    "
                    width="64"
                    height="64"
                    decoding="async"
                    class="h-16 w-16 rounded-full object-cover object-center"
                    alt="avatar"
                  />
                </div>
              </div>
              <!-- 右側 -->
              <div class="flex flex-col gap-1 text-gray-900">
                <p>{{ post.toukousya.username }}</p>
                <div
                  class="line-clamp-4 text-sm leading-relaxed"
                  :title="post.toukousya.description"
                >
                  {{ post.toukousya.description }}
                </div>
              </div>
            </div>
          </div>

          <hr />

          <!-- 同じ本の他の投稿 -->
          <div class="flex flex-col gap-1">
            <RouterLink
              v-for="r of post.related_post_list"
              :key="r.post_id"
              :class="['flex gap-2', 'cursor-pointer transition-colors hover:text-blue-600']"
              :to="`/post/${r.post_id}`"
            >
              <div class="flex shrink-0 items-center justify-between">
                <MyImage
                  :src-base="
                    post.toukousya.avatar_file_id
                      ? `api/file/download/${post.toukousya.avatar_file_id}`
                      : `https://dummyimage.com/32x32`
                  "
                  width="32"
                  height="32"
                  decoding="async"
                  class="h-8 w-8 rounded-full object-cover object-center"
                  alt="avatar"
                />
              </div>
              <div>
                <p class="line-clamp-2 text-sm">{{ r.post_title }}</p>
                <p class="text-xs text-gray-500">{{ post.toukousya.username }}</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="flex w-80 shrink-0 flex-col gap-4 py-4">
        <div class="table h-64 w-80 border bg-stone-300 p-4">
          <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
        </div>
        <div class="table h-64 w-80 border bg-stone-300 p-4">
          <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
        </div>
      </div>
    </div>
    <MyPulseLoading v-else> </MyPulseLoading>
  </Transition>
</template>
