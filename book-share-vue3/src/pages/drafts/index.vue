<script lang="ts">
import { defineComponent } from "vue";
import { $dialog } from "~/components/Dialog.vue";
import Editor from "~/components/Editor.vue";
import { $loading } from "~/components/Loading.vue";
import { Post, trpc } from "~/middleware/trpc";
import DraftsNavVue from "~/pages/drafts/components/DraftsNav.vue";

export default defineComponent({
  components: {
    DraftsNavVue,
    Editor,
  },
  data() {
    return {
      firstView: true,
      search: {
        queryfield: "ONLY_DRAFTS",
        sortfield: "created_at",
        keyword: "",
      },
      fields: Object.entries({
        ONLY_DRAFTS: "下書きのみ",
        ONLY_PUBLISHED: "公開中のみ",
        ALL_POSTS: "すべて",
      }),
      sortKeys: Object.entries({
        created_at: "作成日時",
        updated_at: "更新日時",
        post_title: "投稿タイトル",
        hearts: "ハート数",
        book_title: "本のタイトル",
      }),
      currentPost: undefined as Post | undefined,
      posts: [] as Post[],
      pager: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  created() {
    this.listDrafts().finally(() => (this.firstView = false));
  },
  methods: {
    handleSubmit() {
      this.listDrafts();
    },
    handleSelect(post: Post) {
      this.currentPost = post;
    },
    handleDelete(post: Post) {
      $dialog
        .open({
          colorset: "danger",
          icon: "bx:error",
          message: `投稿を削除します。よろしいですか？ 投稿タイトル：${post.post_title}`,
        })
        .then(() => {
          this.deleteDraft(post.post_id);
        });
    },
    handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.listDrafts();
    },
    listDrafts() {
      const loading = $loading.open();
      return trpc
        .query("drafts.list", {
          sort: ["created_at"],
          limit: this.pager.pageSize,
          offset: this.pager.pageSize * (this.pager.currentPage - 1),
        })
        .then((data) => {
          this.total = data.total;
          this.posts = data.posts;

          if (this.posts.length) {
            this.currentPost = this.posts.at(0);
          }
        })
        .finally(loading.close);
    },
    deleteDraft(post_id: number) {
      const loading = $loading.open();
      return trpc
        .mutation("drafts.delete", { post_id })
        .then(() => {
          this.posts = this.posts.filter((post) => post.post_id !== post_id);
          this.total--;
        })
        .finally(loading.close);
    },
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <DraftsNavVue> </DraftsNavVue>

    <template v-if="firstView"></template>
    <template v-else-if="posts.length">
      <form class="mb-4 flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- 一段目 -->
        <div class="flex items-center">
          <!-- ラジオボタン -->
          <Icon icon="bx:filter-alt" class="mr-2 h-4 w-4"></Icon>
          <div class="flex">
            <div v-for="[key, label] of fields" :key="key" class="mr-4 flex items-center">
              <input
                :id="`inline-radio-${key}`"
                v-model="search.queryfield"
                type="radio"
                :value="key"
                name="inline-radio-group"
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <label
                :for="`inline-radio-${key}`"
                class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {{ label }}
              </label>
            </div>
          </div>

          <Icon icon="bxs:sort-alt" class="ml-4 mr-2 h-4 w-4"></Icon>
          <div class="flex">
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
          </div>
        </div>
      </form>

      <section class="mb-4 flex flex-row gap-4">
        <div class="flex w-1/2 grow flex-col justify-start gap-4">
          <div class="flex flex-col gap-4">
            <!-- 投稿のタイトルリスト -->
            <div
              v-for="post of posts"
              :key="post.post_id"
              :class="`flex cursor-pointer flex-row gap-2 rounded border-b border-r bg-gray-100 p-4 transition-all hover:bg-white hover:drop-shadow
                ${
                  currentPost && currentPost.post_id === post.post_id
                    ? '-translate-x-0.5 -translate-y-0.5 transform !bg-white !drop-shadow '
                    : ''
                }`"
              @click.prevent="handleSelect(post)"
            >
              <!-- サムネイル -->
              <img
                v-if="
                  post.book &&
                  post.book.volumeInfo &&
                  post.book.volumeInfo.imageLinks &&
                  post.book.volumeInfo.imageLinks.thumbnail
                "
                :title="post.book_title"
                :alt="post.book_title"
                class="h-[91px] w-[64px] rounded object-cover object-center"
                :src="post.book.volumeInfo.imageLinks.thumbnail"
              />
              <!-- サムネイルがなかった時のダミー画像 -->
              <img
                v-else
                alt="content"
                class="h-[91px] w-[64px] rounded object-cover object-center"
                src="https://dummyimage.com/128x182"
              />

              <div class="flex grow flex-col gap-2">
                <div class="flex flex-row items-end justify-between">
                  <p class="-mb-2 text-xs text-gray-400">
                    {{
                      `${post.book && post.book.book_title ? post.book.book_title : "(本未選択)"}`
                    }}
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
                  {{ `${post.post_title ? post.post_title : "(タイトル未設定)"}` }}
                </p>
                <div class="flex justify-between">
                  <div class="flex flex-row gap-2 py-2">
                    <p class="text-xs">
                      作成 <span class="text-gray-400">{{ post.created_at | timestamp }}</span>
                    </p>
                    <p class="text-xs">
                      更新 <span class="text-gray-400">{{ post.updated_at | timestamp }}</span>
                    </p>
                  </div>

                  <transition
                    enter-class="opacity-0"
                    enter-active-class="ease-out duration-200"
                    enter-to-class="opacity-100"
                    leave-class="opacity-100"
                    leave-active-class="ease-in duration-200"
                    leave-to-class="opacity-0"
                  >
                    <div
                      v-show="currentPost && currentPost.post_id === post.post_id"
                      class="flex flex-row gap-2"
                    >
                      <RouterLink
                        tag="button"
                        class="inline-flex items-center rounded-lg border border-blue-800 bg-transparent px-3 py-1 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
                        :to="`/drafts/${post.post_id}`"
                      >
                        <Icon icon="line-md:edit-twotone" class="-ml-1 mr-1 h-4 w-4"></Icon>
                        <p>編集</p>
                      </RouterLink>
                      <button
                        type="button"
                        class="inline-flex items-center rounded-lg border border-yellow-800 bg-transparent px-3 py-1 text-center text-xs font-medium text-yellow-900 hover:bg-yellow-900 hover:text-white focus:outline-none focus:ring-1 focus:ring-yellow-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
                        @click.prevent="handleDelete(post)"
                      >
                        <Icon icon="fa6-solid:trash" class="-ml-1 mr-1 h-3 w-3"></Icon>
                        <p>削除</p>
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
          <!-- ページング -->
          <VxePager
            class="!bg-transparent"
            background
            size="small"
            :current-page="pager.currentPage"
            :page-size="pager.pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
            @page-change="handlePageChange"
          ></VxePager>
        </div>
        <!-- プレビュー -->
        <div class="w-1/2 grow">
          <Editor v-show="currentPost" v-model="currentPost.content" :editable="false"> </Editor>
        </div>
      </section>
    </template>

    <template v-else>
      <div class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300" role="alert">
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">まだ投稿はありません！</h3>
        </div>
        <div class="mb-4 mt-2 text-sm text-blue-900">
          本を読んだら投稿を書いて、 BOOK を SHARE しましょう
        </div>
        <div class="flex">
          <RouterLink
            tag="button"
            class="rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
            to="/drafts/new"
          >
            さっそく投稿を書く
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>
