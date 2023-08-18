<script setup lang="ts">
import Editor from '~/pages/components/Editor.vue';
import { trpc } from '~/middleware/trpc';
import { useValidate } from '~/composables/useValidate';
import type { z } from '~/lib/zod';
import { PostRouterSchema } from '~/schema/PostRouterSchema';
import type { RouterOutput } from '~/lib/trpc';
import {
  openConfirmDialog,
  openLoading,
  openSuccessToast,
} from '~/utils/ProgrammaticComponentHelper';
import { SearchParamPostStatusList } from '~/schema/option/PostStatusSchema';

const router = useRouter();

const modelValue = ref<z.infer<typeof PostRouterSchema.listInput>>({
  where: {
    keyword: '',
    postStatus: '下書き',
  },
  sort: [{ created_at: 'desc' }],
  limit: 30,
  offset: 0,
});

const { formId, validateSubmit } = useValidate(PostRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['post']['getMyPostList']>({
  total: 0,
  post_list: [],
});
const loading = ref(false);

const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.post.getMyPostList.query(modelValue.value);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  handleSubmit();
});

const currentPost = ref<RouterOutput['post']['getMyPostList']['post_list'][number]>();

async function handleDelete(post: RouterOutput['post']['getMyPostList']['post_list'][number]) {
  if (
    await openConfirmDialog(
      `データを削除しますか？\nこの操作は取り消せません。\n投稿タイトル: ${post.post_title}`,
    )
  ) {
    const loading = openLoading();
    try {
      await trpc.post.delete.mutate({ post_id: post.post_id, updated_at: post.updated_at });

      router.replace(`/zinzi/hyouka_kanten`);

      openSuccessToast('データを削除しました。');
    } finally {
      loading.close();
    }
  }
}

// TODO
// export default Vue.extend({
//   data() {
//     return {
//       search: {
//         queryfield: 'ONLY_DRAFTS',
//         sortfield: 'created_at',
//         keyword: '',
//       },
//       fields: Object.entries({
//         ONLY_DRAFTS: '下書きのみ',
//         ONLY_PUBLISHED: '公開中のみ',
//         ALL_POSTS: 'すべて',
//       }),
//       sortKeys: Object.entries({
//         created_at: '作成日時',
//         updated_at: '更新日時',
//         post_title: '投稿タイトル',
//         hearts: 'ハート数',
//         book_title: '本のタイトル',
//       }),
//     };
//   },
// });
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="uil:setting"
      :items="[
        {
          label: '投稿一覧',
          to: '/my-post',
        },
      ]"
    >
    </MyBreadcrumb>

    <div class="container mx-auto my-4">
      <div class="flex flex-col gap-8 overflow-y-auto">
        <header>
          <form class="mb-4 flex flex-col gap-4" @submit.prevent="handleSubmit">
            <!-- 一段目 -->
            <div class="flex items-center">
              <!-- フィルター -->
              <Icon icon="bx:filter-alt" class="mr-2 h-4 w-4"></Icon>
              <div class="flex">
                <div
                  v-for="option of SearchParamPostStatusList"
                  :key="option"
                  class="mr-4 flex items-center"
                >
                  <input
                    :id="`inline-radio-${option}`"
                    v-model="modelValue.where.postStatus"
                    type="radio"
                    :value="option"
                    name="inline-radio-group"
                    class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    :for="`inline-radio-${option}`"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {{ option }}
                  </label>
                </div>
              </div>

              <!-- ソート -->
              <Icon icon="bxs:sort-alt" class="ml-4 mr-2 h-4 w-4"></Icon>
              <!-- <div class="flex">
                <div v-for="[key, label] of sortKeys" :key="key" class="mr-4 flex items-center">
                  <input
                    :id="`inline-checkbox-${key}`"
                    v-model="search.sortfield"
                    type="radio"
                    :value="key"
                    class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    :for="`inline-checkbox-${key}`"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {{ label }}
                  </label>
                </div>
              </div> -->
            </div>
          </form>
        </header>

        <main class="shrink grow overflow-y-auto">
          <section class="mb-4 flex flex-row gap-4">
            <div class="flex w-1/2 grow flex-col justify-start gap-4">
              <div class="flex flex-col gap-4">
                <!-- 投稿のタイトルリスト -->
                <div
                  v-for="post of data.post_list"
                  :key="post.post_id"
                  :class="[
                    'flex relative cursor-pointer flex-row gap-2 rounded border-b border-r bg-gray-100 p-4 transition-all hover:bg-white hover:drop-shadow',
                    currentPost && currentPost.post_id === post.post_id
                      ? '-translate-x-0.5 -translate-y-0.5 transform !bg-white !drop-shadow '
                      : '',
                  ]"
                  @click.prevent="currentPost = post"
                >
                  <!-- サムネイル -->
                  <img
                    :title="post.volume?.volumeInfo?.title ?? ''"
                    :alt="post.volume?.volumeInfo?.title ?? ''"
                    class="h-[91px] w-[64px] rounded object-cover object-center"
                    :src="
                      post.volume?.volumeInfo?.imageLinks?.thumbnail ??
                      'https://dummyimage.com/128x182'
                    "
                    height="91"
                    width="64"
                    decoding="async"
                  />

                  <div class="flex grow flex-col gap-2">
                    <div class="flex flex-row items-end justify-between">
                      <p class="-mb-2 text-xs text-gray-400">
                        {{ `${post.volume?.volumeInfo?.title ?? '(本未選択)'}` }}
                      </p>
                      <div class="flex shrink-0 flex-row gap-2">
                        <div
                          v-if="post.published"
                          class="leading-sm inline-flex items-center rounded-full bg-blue-200 px-3 py-1 text-xs font-bold uppercase text-blue-700"
                        >
                          <Icon class="mr-1 h-4 w-4" icon="bxs:lock-open-alt"> </Icon>
                          公開中
                        </div>
                        <div
                          v-else
                          class="leading-sm inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-bold uppercase text-gray-700"
                        >
                          <Icon class="mr-1 h-4 w-4" icon="bxs:lock"> </Icon>
                          下書き
                        </div>
                        <div
                          class="leading-sm inline-flex items-center rounded-full py-1 text-xs font-bold uppercase"
                        >
                          <Icon
                            class="mr-1 h-4 w-4"
                            :icon="
                              post.hearts < 5
                                ? 'akar-icons:heart'
                                : post.hearts < 10
                                ? 'bi:hearts'
                                : 'emojione:revolving-hearts'
                            "
                          >
                          </Icon>
                          {{ `${post.hearts}` }}
                        </div>
                      </div>
                    </div>
                    <p class="text-lg text-gray-900">
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
                      class="flex flex-row gap-2 absolute bottom-2 right-2"
                    >
                      <RouterLink :to="`/my-post/${post.post_id}`">
                        <MyButton type="button" classset="text" colorset="blue" secondary>
                          <Icon icon="line-md:edit-twotone" class="-ml-1 mr-1 h-4 w-4"></Icon>
                          編集
                        </MyButton>
                      </RouterLink>
                      <MyButton
                        type="button"
                        classset="text"
                        colorset="yellow"
                        secondary
                        @click.prevent="handleDelete(post)"
                      >
                        <Icon icon="fa6-solid:trash" class="-ml-1 mr-1 h-3 w-3"></Icon>
                        削除
                      </MyButton>
                    </div>
                  </Transition>
                </div>
              </div>
              <!-- ページング -->
              <!--  -->
              <VxePager
                class="!bg-transparent"
                background
                size="small"
                :loading="loading"
                :current-page="modelValue.offset / modelValue.limit + 1"
                :page-size="modelValue.limit"
                :total="data.total"
                :page-sizes="[10, 20, 30, 40]"
                perfect
                @page-change="
                  ({ pageSize, currentPage }) => {
                    modelValue.limit = pageSize;
                    modelValue.offset = (currentPage - 1) * pageSize;

                    handleSubmit();
                  }
                "
              ></VxePager>
            </div>
            <!-- プレビュー -->
            <div class="w-1/2 grow">
              <Editor v-if="currentPost" v-model="currentPost.content" :editable="false"> </Editor>
            </div>
          </section>
        </main>

        <footer></footer>
      </div>
    </div>

    <!-- TODO -->
    <!--
    <template v-else>
      <div class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300" role="alert">
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">まだ投稿はありません！</h3>
        </div>
        <div class="mt-2 mb-4 text-sm text-blue-900">
          本を読んだら投稿を書いて、 BOOK を SHARE しましょう
        </div>
        <div class="flex">
          <RouterLink
            tag="button"
            class="rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
            to="/my-post/add"
          >
            さっそく投稿を書く
          </RouterLink>
        </div>
      </div>
    </template> -->
  </div>
</template>
