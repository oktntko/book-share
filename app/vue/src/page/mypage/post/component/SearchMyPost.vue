<script setup lang="ts">
import { PostRouterSchema } from '@book-share/express/schema';
import type { z } from '@book-share/lib/zod';
import type { PostScalarFieldEnumSchema } from '@book-share/prisma/schema';
import { SearchParamPostStatusList } from '@book-share/prisma/schema';
import { useVueValidateZod } from 'use-vue-validate-schema/zod';
import type QuillEditor from '~/component/QuillEditor.vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';

const modelValue = ref<z.infer<typeof PostRouterSchema.listInput>>({
  where: {
    keyword: '',
    postStatus: 'すべて',
  },
  sort: { field: 'updated_at', order: 'desc' },
  limit: 30,
  page: 1,
});

const { validateSubmit, ErrorMessage, revert } = useVueValidateZod(
  PostRouterSchema.listInput,
  modelValue,
);

const data = ref<RouterOutput['post']['getMyPostList']>({
  total: 0,
  post_list: [],
});
const loading = ref(true);

const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.post.getMyPostList.query(modelValue.value);
    currentPost.value = data.value.post_list[0];
    refQuillEditor.value?.setContents(currentPost.value?.content);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  handleSubmit();
});

const currentPost = ref<RouterOutput['post']['getMyPostList']['post_list'][number]>();

const sortOptions: { label: string; field: z.infer<typeof PostScalarFieldEnumSchema> }[] = [
  { label: '更新日時', field: 'updated_at' },
  { label: '作成日時', field: 'created_at' },
  { label: '本のタイトル', field: 'book_title' },
  { label: '投稿のタイトル', field: 'post_title' },
  { label: 'ハートの数', field: 'hearts' },
];

const refQuillEditor = useTemplateRef<typeof QuillEditor>('refQuillEditor');
</script>

<template>
  <div class="flex flex-col gap-8 overflow-y-auto">
    <header>
      <form
        class="flex flex-col gap-4"
        @submit.prevent="
          () => {
            modelValue.page = 1;
            handleSubmit();
          }
        "
      >
        <section class="flex flex-col gap-2">
          <!-- 一段目 -->
          <div class="flex items-center gap-4">
            <!-- フィルター -->
            <div class="flex shrink-0 items-start lg:items-center">
              <span class="icon-[bx--filter-alt] mr-2 h-5 w-5"></span>
              <div class="flex flex-col gap-0 lg:flex-row lg:gap-2">
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
                  />
                  {{ option }}
                </label>
              </div>
              <ErrorMessage class="text-xs text-red-600" field="where.postStatus" />
            </div>

            <!-- ソート -->
            <div class="flex shrink-0 items-center">
              <span class="icon-[bx--sort-down] mr-2 h-5 w-5"></span>
              <div class="flex flex-col gap-0 lg:flex-row lg:gap-2">
                <label
                  v-for="sort of sortOptions"
                  :key="sort.field"
                  :for="`orderBy-${sort.field}`"
                  class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  <input
                    :id="`orderBy-${sort.field}`"
                    name="orderBy"
                    type="radio"
                    :value="sort.field"
                    :checked="modelValue.sort.field === sort.field"
                    class="mr-1 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    @change="
                      () => {
                        modelValue.sort = {
                          field: sort.field,
                          order: modelValue.sort.field === sort.field ? 'desc' : 'asc',
                        };
                      }
                    "
                  />
                  {{ sort.label }}
                </label>
                <ErrorMessage class="text-xs text-red-600" field="orderBy" />
              </div>
            </div>
          </div>

          <!-- 二段目 -->
          <div>
            <label for="where.keyword" class="sr-only"> キーワード </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="icon-[flat-color-icons--search] h-5 w-5"> </span>
              </div>
              <input
                id="where.keyword"
                v-model.lazy="modelValue.where.keyword"
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                maxlength="255"
              />
            </div>
            <ErrorMessage class="text-xs text-red-600" field="where.keyword" />
          </div>
        </section>

        <section>
          <MyButton type="submit" classset="text" colorset="green">
            <span class="icon-[line-md--search-twotone] mr-2 -ml-4 h-4 w-4 -rotate-90"></span>
            検索
          </MyButton>
        </section>
      </form>
    </header>

    <main class="shrink grow overflow-y-auto">
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

        <div v-else class="mb-4 flex flex-row gap-4">
          <!-- 検索結果 -->
          <section class="flex w-1/2 grow flex-col gap-4">
            <!-- 投稿のタイトルリスト -->
            <a
              v-for="post of data.post_list"
              :key="post.post_id"
              class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 p-4 transition-colors hover:bg-blue-100"
              :class="
                !currentPost || (currentPost && currentPost.post_id === post.post_id)
                  ? 'bg-white'
                  : currentPost.post_id !== post.post_id
                    ? 'bg-gray-200'
                    : ''
              "
              @click.prevent="
                () => {
                  currentPost = post;
                  refQuillEditor?.setContents(post.content);
                }
              "
            >
              <!-- サムネイル -->
              <img
                :title="post.volume?.volumeInfo?.title ?? ''"
                :alt="post.volume?.volumeInfo?.title ?? ''"
                class="h-[91px] w-[64px] rounded object-cover object-center"
                :src="
                  post.volume?.volumeInfo?.imageLinks?.thumbnail ?? 'https://dummyimage.com/128x182'
                "
                height="91"
                width="64"
                decoding="async"
              />

              <div class="flex grow flex-col gap-2">
                <div class="flex flex-row items-end justify-between">
                  <p class="text-xs text-gray-400">
                    {{ post.volume?.volumeInfo?.title ?? '(本未選択)' }}
                  </p>
                  <div class="flex shrink-0 flex-row gap-2">
                    <div
                      v-if="post.published"
                      class="leading-sm inline-flex items-center rounded-full bg-blue-200 px-3 py-1 text-xs font-bold text-blue-700 uppercase"
                    >
                      <span class="icon-[bxs--lock-open-alt] mr-1 h-4 w-4"> </span>
                      公開中
                    </div>
                    <div
                      v-else
                      class="leading-sm inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700 uppercase"
                    >
                      <span class="icon-[bxs--lock] mr-1 h-4 w-4"> </span>
                      下書き
                    </div>
                    <div
                      class="leading-sm inline-flex items-center rounded-full py-1 text-xs font-bold uppercase"
                    >
                      <span
                        class="mr-1 h-4 w-4"
                        :class="
                          post.hearts < 5
                            ? 'icon-[akar-icons--heart]'
                            : post.hearts < 10
                              ? 'icon-[bi--hearts]'
                              : 'icon-[emojione--revolving-hearts]'
                        "
                      >
                      </span>
                      {{ post.hearts }}
                    </div>
                  </div>
                </div>
                <p class="text-left text-lg text-gray-900">
                  {{ `${post.post_title || '(タイトル未設定)'}` }}
                </p>
                <div class="flex justify-between">
                  <div class="flex flex-row gap-2 py-2">
                    <p class="text-xs">
                      作成
                      <span class="text-gray-400">{{ post.created_at.toLocaleString() }}</span>
                    </p>
                    <p class="text-xs">
                      更新
                      <span class="text-gray-400">{{ post.updated_at.toLocaleString() }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <Transition
                enter-from-class="opacity-0"
                enter-active-class="ease-out duration-200"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-active-class="ease-in duration-200"
                leave-to-class="opacity-0"
              >
                <div
                  v-show="currentPost && currentPost.post_id === post.post_id"
                  class="absolute right-2 bottom-2 flex flex-row gap-2"
                >
                  <RouterLink
                    :to="`/mypage/post/${post.post_id}`"
                    class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-800 hover:text-white focus:ring focus:outline-none"
                  >
                    <span class="icon-[line-md--edit-twotone] mr-1 -ml-1 h-4 w-4"></span>
                    編集
                  </RouterLink>
                  <MyButton
                    type="button"
                    classset="text"
                    colorset="yellow"
                    secondary
                    @click.prevent="
                      async () => {
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

                            data.post_list = data.post_list.filter(
                              (inlist) => inlist.post_id !== post.post_id,
                            );

                            $toast.success('データを削除しました。');
                          } finally {
                            loading.close();
                          }
                        }
                      }
                    "
                  >
                    <span class="icon-[fa6-solid--trash] mr-1 -ml-1 h-3 w-3"></span>
                    削除
                  </MyButton>
                </div>
              </Transition>
            </a>

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
          </section>
          <!-- プレビュー -->
          <section class="w-1/2 grow">
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

    <footer></footer>
  </div>
</template>
