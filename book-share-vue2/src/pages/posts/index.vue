<template>
  <div class="container mx-auto p-4">
    <div class="flex gap-8">
      <div class="w-80 shrink-0 p-2">
        <header class="flex items-center justify-between">
          <p>今、読まれています</p>
          <div class="flex justify-end gap-2 text-xs">
            <a
              :class="`cursor-pointer text-blue-900 transition-colors hover:text-blue-500 hover:underline
                ${span === 'WEEK' ? 'font-bold' : ''}`"
              @click="handleRankingSpanClicked('WEEK')"
            >
              週刊
            </a>
            <a
              :class="`cursor-pointer text-blue-900 transition-colors hover:text-blue-500 hover:underline
                ${span === 'MONTH' ? 'font-bold' : ''}`"
              @click="handleRankingSpanClicked('MONTH')"
            >
              月間
            </a>
            <a
              :class="`cursor-pointer text-blue-900 transition-colors hover:text-blue-500 hover:underline
                ${span === 'ALL' ? 'font-bold' : ''}`"
              @click="handleRankingSpanClicked('ALL')"
            >
              累計
            </a>
          </div>
        </header>
        <div class="flex flex-col gap-2 py-4">
          <div
            v-for="(book, i) of books"
            :key="book.book_id"
            class="flex gap-4 rounded border bg-white p-4"
          >
            <!-- ランキング -->
            <div class="flex items-center">
              {{ i + 1 }}
            </div>
            <!-- サムネイル -->
            <div class="flex shrink-0 flex-col">
              <div class="relative mx-auto inline">
                <template
                  v-if="
                    book.volumeInfo &&
                    book.volumeInfo.imageLinks &&
                    book.volumeInfo.imageLinks.thumbnail
                  "
                >
                  <img
                    :title="book.book_title"
                    :alt="book.book_title"
                    class="relative z-10 h-[94px] w-[64px] rounded object-cover object-center"
                    :src="book.volumeInfo.imageLinks.thumbnail"
                  />
                  <img
                    :title="book.book_title"
                    :alt="book.book_title"
                    class="absolute -bottom-1 left-1 z-[9] h-[94px] w-[64px] object-cover object-center opacity-80 blur"
                    :src="book.volumeInfo.imageLinks.thumbnail"
                  />
                </template>
                <template v-else>
                  <!-- サムネイルがなかった時のダミー画像 -->
                  <img
                    class="relative z-10 h-[94px] w-[64px] rounded object-cover object-center"
                    src="https://dummyimage.com/64x94"
                    alt="content"
                  />
                  <img
                    class="absolute -bottom-2 left-2 z-[9] h-[94px] w-[64px] object-cover object-center opacity-80 blur"
                    src="https://dummyimage.com/64x94"
                    alt="content"
                  />
                </template>
              </div>
            </div>
            <!-- 右側 -->
            <div v-if="book.volumeInfo" class="flex flex-col gap-1 text-gray-800">
              <h2 v-if="book.book_title" class="line-clamp line-clamp-2 text-base">
                {{ book.book_title }}
              </h2>
              <h3 v-if="book.volumeInfo.authors" class="text-xs text-blue-500 transition-colors">
                {{ book.volumeInfo.authors.join(", ") }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="flex grow flex-col justify-start gap-4">
        <div class="flex flex-col gap-4">
          <!-- 投稿のタイトルリスト -->
          <div
            v-for="post of posts"
            :key="post.post_id"
            :class="`flex cursor-pointer flex-row gap-2 rounded border-b border-r bg-gray-100 p-4 transition-all hover:bg-white hover:drop-shadow`"
            @click.prevent="handleSelect(post.post_id)"
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
                  {{ `${post.book && post.book.book_title ? post.book.book_title : "(本未選択)"}` }}
                </p>
                <div class="flex shrink-0 flex-row gap-2">
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
      <div class="w-80 shrink-0">
        <div class="flex flex-col gap-4">
          <div class="table h-64 w-80 border bg-stone-300 p-4">
            <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
          </div>
          <div class="table h-64 w-80 border bg-stone-300 p-4">
            <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $loading } from "~/components/Loading.vue";
import { Book, Post, trpc } from "~/libs/trpc";

export default Vue.extend({
  data() {
    return {
      span: "ALL" as "ALL" | "WEEK" | "MONTH",
      books: [] as Book[],
      posts: [] as Post[],
      pager: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  created() {
    this.listPosts();
    this.rankingPosts();
  },
  methods: {
    listPosts() {
      const loading = $loading.open();
      return trpc
        .query("posts.list", {
          sort: ["created_at"],
          limit: this.pager.pageSize,
          offset: this.pager.pageSize * (this.pager.currentPage - 1),
        })
        .then((data) => {
          this.total = data.total;
          this.posts = data.posts;
        })
        .finally(loading.close);
    },
    handleRankingSpanClicked(span: "ALL" | "WEEK" | "MONTH") {
      this.span = span;
      this.rankingPosts();
    },
    rankingPosts() {
      return trpc
        .query("posts.ranking", {
          span: this.span,
        })
        .then((data) => {
          this.books = data.books;
        });
    },
    handleSelect(post_id: number) {
      this.$router.push(`/posts/${post_id}`);
    },
    handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.listPosts();
    },
  },
});
</script>
