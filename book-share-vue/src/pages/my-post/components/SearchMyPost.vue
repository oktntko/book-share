<script setup lang="ts">
import * as R from 'remeda';
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import type { z } from '~/lib/zod';
import { trpc } from '~/middleware/trpc';
import Editor from '~/pages/components/Editor.vue';
import { PostRouterSchema } from '~/schema/PostRouterSchema';
import { SearchParamPostStatusList } from '~/schema/option/PostStatusSchema';
import type { PostScalarFieldEnumSchema } from '~/schema/zod/inputTypeSchemas';
import {
  openConfirmDialog,
  openLoading,
  openSuccessToast,
} from '~/utils/ProgrammaticComponentHelper';

const router = useRouter();

const modelValue = ref<z.infer<typeof PostRouterSchema.listInput>>({
  where: {
    keyword: '',
    postStatus: 'すべて',
  },
  sort: { created_at: 'desc' },
  limit: 30,
  offset: 0,
});

const { formId, validateSubmit, revert } = useValidate(PostRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['post']['getMyPostList']>({
  total: 0,
  post_list: [],
});
const loading = ref(true);

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

const sortOptions: { label: string; value: z.infer<typeof PostScalarFieldEnumSchema> }[] = [
  { label: '作成日時', value: 'created_at' },
  { label: '更新日時', value: 'updated_at' },
  { label: '本のタイトル', value: 'book_title' },
  { label: '投稿のタイトル', value: 'post_title' },
  { label: 'ハートの数', value: 'hearts' },
];
</script>

<template>
  <div class="flex flex-col gap-8 overflow-y-auto">
    <header>
      <form
        class="flex flex-col gap-4"
        @submit.prevent="
          () => {
            modelValue.offset = 0;
            handleSubmit();
          }
        "
      >
        <section class="flex flex-col gap-2">
          <!-- 一段目 -->
          <div class="flex items-center gap-4">
            <!-- フィルター -->
            <div class="flex shrink-0 items-center">
              <Icon icon="bx:filter-alt" class="mr-2 h-5 w-5"></Icon>
              <div class="flex gap-2">
                <label
                  v-for="option of SearchParamPostStatusList"
                  :key="option"
                  :for="`postStatus-${option}`"
                  class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  <input
                    :id="`postStatus-${option}`"
                    v-model="modelValue.where.postStatus"
                    type="radio"
                    :value="option"
                    class="mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  {{ option }}
                </label>
              </div>
              <MyErrorMessage class="text-xs text-red-600" :form-id="formId" name="postStatus" />
            </div>

            <!-- ソート -->
            <div class="flex shrink-0 items-center">
              <Listbox
                as="div"
                :model-value="modelValue.sort"
                :by="(currentSort: object, sortOption: any) => sortOption.value in currentSort"
                @update:model-value="
                  (sortOption) => {
                    const currentSortValue = R.pathOr(
                      modelValue.sort,
                      [sortOption.value],
                      undefined,
                    );

                    modelValue.sort = {
                      [sortOption.value]: currentSortValue === 'desc' ? 'asc' : 'desc',
                    };
                  }
                "
              >
                <ListboxButton
                  class="relative flex w-48 items-center gap-2 rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                >
                  <Icon
                    :icon="
                      R.values(modelValue.sort).at(0) === 'desc' ? 'bx:sort-down' : 'bx:sort-up'
                    "
                    class="h-5 w-5"
                  ></Icon>
                  <span>
                    {{
                      sortOptions.find((sortOption) => sortOption.value in modelValue.sort)?.label
                    }}
                  </span>
                  <Icon icon="mingcute:down-fill" class="absolute right-2 h-5 w-5"></Icon>
                </ListboxButton>

                <Transition
                  enter-from-class="transform opacity-0 scale-95 -translate-y-4"
                  enter-active-class="transition ease-out duration-150"
                  enter-to-class="transform opacity-100 scale-100 translate-y-0"
                  leave-from-class="transform opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition ease-in duration-100"
                  leave-to-class="transform opacity-0 scale-95 -translate-y-4"
                >
                  <ListboxOptions
                    class="absolute z-10 w-48 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <ListboxOption
                      v-for="sortOption of sortOptions"
                      v-slot="{ active, selected }"
                      :key="sortOption.value"
                      :value="sortOption"
                      as="template"
                    >
                      <li
                        :class="[
                          selected ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900',
                          'relative flex cursor-pointer select-none items-center gap-2 px-4 py-2',
                        ]"
                      >
                        <Icon
                          :icon="
                            !selected
                              ? ''
                              : R.values(modelValue.sort).at(0) === 'desc'
                              ? 'bx:sort-down'
                              : 'bx:sort-up'
                          "
                          class="h-5 w-5"
                        ></Icon>
                        <span :class="[selected ? 'font-bold' : 'font-normal', 'block truncate']">
                          {{ sortOption.label }}
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </Listbox>
            </div>
          </div>

          <!-- 二段目 -->
          <div>
            <label for="where.keyword" class="sr-only"> キーワード </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
              </div>
              <input
                id="where.keyword"
                v-model.lazy="modelValue.where.keyword"
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                maxlength="255"
              />
            </div>
            <MyErrorMessage class="text-xs text-red-600" :form-id="formId" name="where.keyword" />
          </div>
        </section>

        <section>
          <MyButton type="submit" classset="text" colorset="green">
            <Icon
              :horizontal-flip="true"
              inline
              icon="line-md:search-twotone"
              class="-ml-4 mr-2 h-4 w-4"
            ></Icon>
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
        <MyPulseLoading v-if="loading"> </MyPulseLoading>

        <div v-else class="mb-4 flex flex-row gap-4">
          <!-- 検索結果 -->
          <OnClickOutside
            as="section"
            class="flex w-1/2 grow flex-col gap-4"
            @trigger="currentPost = undefined"
          >
            <!-- 投稿のタイトルリスト -->
            <button
              v-for="post of data.post_list"
              :key="post.post_id"
              class="relative flex cursor-pointer flex-row gap-2 rounded border border-gray-300 p-4 transition-colors hover:bg-blue-100"
              :class="
                !currentPost || (currentPost && currentPost.post_id === post.post_id)
                  ? 'bg-white'
                  : currentPost.post_id !== post.post_id
                  ? 'bg-neutral-200'
                  : ''
              "
              @click.prevent="currentPost = post"
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
                  class="absolute bottom-2 right-2 flex flex-row gap-2"
                >
                  <RouterLink :to="`/my-post/${post.post_id}`" tabindex="-1">
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
            </button>

            <!-- ページング -->
            <!--  -->
            <VxePager
              v-if="data.post_list.length"
              class="!border-none !bg-transparent"
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
            <div v-else>
              <div
                class="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700"
                role="alert"
              >
                <div class="flex">
                  <div class="py-1">
                    <Icon
                      class="mr-4 h-8 w-8 fill-current text-yellow-500"
                      icon="fa6-regular:face-dizzy"
                    >
                    </Icon>
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
                        >条件をリセットしてトライ</a
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </OnClickOutside>
          <!-- プレビュー -->
          <section class="w-1/2 grow">
            <Editor v-if="currentPost" v-model="currentPost.content" :editable="false"> </Editor>
          </section>
        </div>
      </Transition>
    </main>

    <footer></footer>
  </div>
</template>
