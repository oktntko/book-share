<template>
  <div class="container mx-auto p-4">
    <LibraryNavVue> </LibraryNavVue>

    <!-- 検索フォーム -->
    <form class="mb-4 flex flex-col gap-2" @submit.prevent="handleSubmit">
      <!-- １段目 -->
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
      </div>

      <!-- ２段目 -->
      <div>
        <label
          for="default-search"
          class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Search
        </label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
          </div>
          <input
            id="default-search"
            v-model="search.keyword"
            type="search"
            class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="検索ワード"
            required
          />
        </div>
      </div>
    </form>

    <!-- 検索結果 -->
    <div>
      <div class="masonry-wrapper">
        <div
          v-for="bookVolume of bookVolumes"
          :key="bookVolume.book_id"
          class="masonry-item py-4 px-2"
        >
          <BookVue
            :book="bookVolume.book"
            :hoverable="false"
            :show-description="false"
            class="rounded border bg-gray-100"
          >
            <template #header>
              <!-- ステータス -->
              <header class="mb-4 flex items-center gap-4 text-sm">
                <div
                  :class="`leading-sm text inline-flex items-center rounded-2xl px-3 py-1 font-bold uppercase
                    ${
                      bookVolume.status === '予約中'
                        ? 'bg-blue-100 text-blue-500'
                        : bookVolume.status === '借用中'
                        ? 'bg-blue-200 text-blue-700'
                        : bookVolume.status === '在庫あり'
                        ? 'bg-green-200 text-green-700'
                        : // 在庫なし
                          'bg-gray-200 text-gray-700'
                    }`"
                >
                  {{ bookVolume.status }}
                </div>
                <div class="text-xs">
                  {{ bookVolume.stock_count }} / {{ bookVolume.all_count }} (在庫数 / 全件数)
                </div>
              </header>
            </template>

            <template #footer>
              <footer class="mt-6">
                <button
                  v-if="bookVolume.status === '予約中' || bookVolume.status === '借用中'"
                  type="button"
                  class="inline-flex justify-center rounded-lg border border-blue-800 bg-blue-100 px-4 py-2 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-blue-600 hover:text-white"
                  @click="handleBack(bookVolume)"
                >
                  {{ bookVolume.status === "予約中" ? "予約を取り消す" : "借りている本を返す" }}
                </button>
                <button
                  v-else
                  type="button"
                  :class="`inline-flex justify-center rounded-lg border px-4 py-2 text-center text-sm font-medium transition-colors
                    ${
                      bookVolume.status === '在庫なし'
                        ? 'border-gray-400 bg-white text-gray-400 hover:bg-gray-400 hover:text-white'
                        : 'border-green-800 bg-green-100 text-gray-900 hover:bg-green-600 hover:text-white'
                    }`"
                  @click.stop="showVolumes(bookVolume)"
                >
                  借りる・予約する
                </button>
              </footer>
            </template>
          </BookVue>
        </div>
      </div>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { $loading } from "~/components/Loading.vue";
import { $sidemenu } from "~/components/Sidemenu.vue";
import { BookVolume, trpc, VolumesQuery } from "~/libs/trpc";
import BookVue from "~/pages/books/components/Book.vue";
import LibraryNavVue from "~/pages/library/components/LibraryNav.vue";
import ShowVolumesVue from "~/pages/library/components/ShowVolumes.vue";

export default Vue.extend({
  components: { LibraryNavVue, BookVue },
  data() {
    const book_id = typeof this.$route.query.book_id === "string" ? this.$route.query.book_id : "";

    return {
      search: {
        book_id,
      } as VolumesQuery,
      bookVolumes: [] as BookVolume[],
      loading: true,
      pager: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
      fields: Object.entries({
        ALL: "すべて",
        HAS_STOCK: "在庫あり",
      }),
    };
  },
  created() {
    this.searchVolumes();
  },
  methods: {
    handleSubmit() {
      this.searchVolumes();
    },
    handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.searchVolumes();
    },
    searchVolumes() {
      const loading = $loading.open();
      return trpc
        .query("volumes.search", {
          ...this.search,
          limit: this.pager.pageSize,
          offset: this.pager.pageSize * (this.pager.currentPage - 1),
        })
        .then((data) => {
          this.total = data.total;
          this.bookVolumes = data.bookVolumes;
        })
        .finally(loading.close);
    },
    async handleBack(bookVolume: BookVolume) {
      if (bookVolume.status === "借用中") {
        await $dialog.open({
          colorset: "warning",
          icon: "bx:info-circle",
          message: "本を返却します。本棚は確認しましたか？",
        });
      }

      await Promise.all(
        bookVolume.volumes
          .filter((volume) => volume.borrower_id)
          .map((volume) => {
            return trpc.mutation("volumes.back", {
              volume_id: volume.volume_id,
            });
          })
      );

      if (bookVolume.status === "借用中") {
        await $dialog
          .open({
            colorset: "info",
            icon: "bx:info-circle",
            message: "このまま投稿を書きますか？",
            confirmText: "YES",
            cancelText: "NO",
          })
          .then(() => {
            this.$router.push({
              path: `/drafts/new`,
              query: { book_id: bookVolume.book_id },
            });
          })
          .catch(this.searchVolumes);
      } else {
        this.searchVolumes();
      }
    },
    showVolumes(bookVolume: BookVolume) {
      $sidemenu.open({
        component: ShowVolumesVue,
        componentProps: {
          bookVolume,
        },
        componentEvents: {
          borrow: () => {
            this.searchVolumes();
          },
          reserve: () => {
            this.searchVolumes();
          },
        },
      });
    },
  },
});
</script>

<style scoped></style>
