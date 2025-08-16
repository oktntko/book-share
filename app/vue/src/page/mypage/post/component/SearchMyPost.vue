<script setup lang="ts">
import { PostRouterSchema } from '@book-share/express/schema';
import type { z } from '@book-share/lib/zod';
import { SearchParamPostStatusList } from '@book-share/prisma/schema';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import type QuillEditor from '~/component/QuillEditor.vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';
import PostCard from './PostCard.vue';

const $router = useRouter();

const json = restoreSession();
const modelValue = ref<z.infer<typeof PostRouterSchema.listInput>>(
  json
    ? JSON.parse(json)
    : {
        where: {
          keyword: '',
          postStatus: 'すべて',
        },
        sort: { field: 'updated_at', order: 'desc' },
        limit: 30,
        page: 1,
      },
);

const { validateSubmit, revert } = useVueValidateZod(PostRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['post']['getMyPostList']>({
  total: 0,
  post_list: [],
});
const loading = ref(true);

const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.post.getMyPostList.query(modelValue.value);

    if (data.value.total) {
      saveSession();
    }

    currentPost.value = data.value.post_list[0];
    refQuillEditor.value?.setContents(currentPost.value?.content);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  return handleSubmit();
});

const KEY_POST_SEARCH = 'KEY_POST_SEARCH';

function saveSession() {
  sessionStorage.setItem(KEY_POST_SEARCH, JSON.stringify(modelValue.value));
}
function clearSession() {
  sessionStorage.removeItem(KEY_POST_SEARCH);
}
function restoreSession() {
  return sessionStorage.getItem(KEY_POST_SEARCH);
}

const currentPost = ref<RouterOutput['post']['getMyPostList']['post_list'][number]>();

const refQuillEditor = useTemplateRef<typeof QuillEditor>('refQuillEditor');

const { y } = useWindowScroll();
</script>

<template>
  <header>
    <form
      class="flex flex-col gap-4"
      @submit.prevent="
        () => {
          modelValue.page = 1;
          return handleSubmit();
        }
      "
    >
      <div class="flex">
        <div class="relative grow">
          <input
            id="where.keyword"
            v-model="modelValue.where.keyword"
            type="search"
            class="block w-full rounded-s-lg border border-e-0 border-gray-300 bg-white p-2 text-sm text-gray-900 transition-all"
            :class="['focus:ring focus:ring-gray-300 focus:outline-none']"
            required
            autofocus
            @search="
              () => {
                // イベントが発生するのは、①Enter によって検索を実行したとき or ②xボタンをクリックしたとき
                if (!modelValue.where.keyword) {
                  revert();
                  clearSession();
                }
              }
            "
          />
        </div>
        <div class="relative shrink-0">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-e-lg border px-4 py-2 text-sm transition-all focus:ring focus:outline-none"
            :class="['border-blue-700 bg-white text-blue-700 hover:bg-blue-800 hover:text-white']"
          >
            <span class="icon-[line-md--search-twotone] mr-2 -ml-2 h-5 w-5"></span>
            検索
          </button>
        </div>
      </div>
      <!-- フィルター -->
      <div class="flex shrink-0 items-center">
        <span class="icon-[bx--filter-alt] mr-2 h-5 w-5"></span>
        <div class="flex flex-row gap-2">
          <label
            v-for="option of SearchParamPostStatusList"
            :key="option"
            :for="`where.postStatus-${option}`"
            class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              :id="`where.postStatus-${option}`"
              v-model="modelValue.where.postStatus"
              type="radio"
              :value="option"
              class="mr-1 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              @change="handleSubmit"
            />
            {{ option }}
          </label>
        </div>
      </div>
    </form>
  </header>

  <main class="shrink grow">
    <Transition
      mode="out-in"
      enter-from-class="transform opacity-0"
      enter-active-class="transition ease-out duration-200"
      enter-to-class="transform opacity-100"
      leave-from-class="transform opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-to-class="transform opacity-0"
    >
      <MyLoading v-if="loading"> </MyLoading>

      <div v-else class="flex flex-row gap-4">
        <!-- 検索結果 -->
        <div
          class="sticky top-0 flex w-full flex-col gap-4 md:w-1/2 md:overflow-y-auto md:pr-2"
          :style="{
            'max-height': `calc(100dvh - ${217.6 - Math.min(y, 217.6)}px)`,
          }"
        >
          <!-- 投稿のタイトルリスト -->
          <PostCard
            v-for="post of data.post_list"
            :key="post.post_id"
            :post="post"
            :class="[{ 'bg-blue-100!': currentPost?.post_id === post.post_id }]"
            @select="
              (post) => {
                if (currentPost !== post) {
                  currentPost = post;
                  refQuillEditor?.setContents(post.content);
                  $window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            "
            @edit="
              (post) => {
                $router.push({ name: '/mypage/post/[post_id]', params: { post_id: post.post_id } });
              }
            "
            @delete="
              async (post) => {
                if (
                  await $dialog.confirm(
                    `データを削除しますか？\nこの操作は取り消せません。\n投稿タイトル: ${post.post_title}`,
                  )
                ) {
                  const loading = $loading.open();
                  try {
                    await trpc.post.delete.mutate({
                      post_id: post.post_id,
                      updated_at: post.updated_at,
                    });

                    data.post_list = data.post_list.filter((x) => x.post_id !== post.post_id);

                    $toast.success('データを削除しました。');
                  } finally {
                    loading.close();
                  }
                }
              }
            "
          >
          </PostCard>

          <!-- ページング -->
          <MyPaginator
            v-if="data.post_list.length"
            :currentPage="modelValue.page"
            :limit="modelValue.limit"
            :total="data.total"
            @click="
              (page) => {
                modelValue.page = page;
                handleSubmit();
              }
            "
          >
          </MyPaginator>
          <div v-else>
            <div
              class="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700"
              role="alert"
            >
              <div class="flex">
                <div class="py-1">
                  <span
                    class="icon-[fa6-regular--face-dizzy] mr-4 h-8 w-8 fill-current text-yellow-500"
                  >
                  </span>
                </div>
                <div>
                  <p class="font-bold">条件に該当する記事は見つかりませんでした。</p>
                  <p class="text-sm">
                    <a
                      class="cursor-pointer text-sm text-blue-700 underline"
                      @click="
                        () => {
                          revert();
                          handleSubmit();
                        }
                      "
                    >
                      条件をリセットしてトライ
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- プレビュー -->
        <section class="hidden grow md:block md:w-1/2">
          <QuillEditor
            v-if="currentPost"
            ref="refQuillEditor"
            v-model="currentPost.content"
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
        </section>
      </div>
    </Transition>
  </main>
</template>
