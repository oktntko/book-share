<template>
  <div class="container mx-auto p-4">
    <LibraryNavVue> </LibraryNavVue>

    <!-- 検索結果 -->
    <div>
      <VxeTable
        :loading="loading"
        :height="loading ? 300 : undefined"
        border
        resizable
        :data="volumes"
      >
        <VxeColumn field="status" width="200" title="状態" sortable>
          <template #default="{ row }">
            <div class="inline-flex">
              <div
                class="leading-sm mr-3 inline-flex items-center rounded-2xl bg-blue-200 px-3 py-1 text-xs font-bold uppercase text-blue-700"
              >
                借用中
              </div>
              <div class="flex flex-col">
                <span class="-my-2 text-[0.5rem]">借用日</span>
                <span>{{ row.borrow_date }}</span>
              </div>
            </div>
          </template>
        </VxeColumn>
        <VxeColumn field="bookshelf" width="200" title="本棚" sortable></VxeColumn>
        <VxeColumn field="book.book_title" title="タイトル" sortable> </VxeColumn>
        <VxeColumn width="184">
          <template #default="{ row }">
            <div class="flex justify-center">
              <button
                type="button"
                class="inline-flex w-32 items-center justify-center rounded-lg border border-blue-800 bg-transparent px-3 py-1 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
                @click="handleBack(row.volume_id, row)"
              >
                {{ row.status === "LENDING" ? "返却する" : "キャンセルする" }}
              </button>
            </div>
          </template>
        </VxeColumn>
        <template #empty>
          <div
            class="border-t border-b border-yellow-500 bg-yellow-100 px-4 py-3 text-yellow-700"
            role="alert"
          >
            <p class="font-bold">本を借りましょう！</p>
          </div>
        </template>
      </VxeTable>
      <VxePager
        perfect
        :loading="loading"
        :current-page="pager.currentPage"
        :page-size="pager.pageSize"
        :total="total"
        :layouts="[
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'Sizes',
          'FullJump',
          'Total',
        ]"
        @page-change="handlePageChange"
      >
        <template #left> </template>
        <template #right> </template>
      </VxePager>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { trpc, Volume, VolumesQuery } from "~/libs/trpc";
import LibraryNavVue from "~/pages/library/components/LibraryNav.vue";

export default Vue.extend({
  components: { LibraryNavVue },
  data() {
    return {
      search: {} as VolumesQuery,
      volumes: [] as Volume[],
      loading: true,
      pager: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
      fields: Object.entries({
        ONLY_DRAFTS: "すべて",
        ONLY_PUBLISHED: "在庫あり",
      }),
      sortKeys: Object.entries({
        book_title: "本のタイトル",
        created_at: "作成日時",
      }),
    };
  },
  created() {
    this.listVolumes();
  },
  methods: {
    handleSubmit() {
      this.listVolumes();
    },
    handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.listVolumes();
    },
    listVolumes() {
      this.loading = true;
      return trpc
        .query("volumes.list", {
          borrower: "IAM",
          sort: ["bookshelf", "book_title"],
          limit: this.pager.pageSize,
          offset: this.pager.pageSize * (this.pager.currentPage - 1),
        })
        .then((data) => {
          this.total = data.total;
          this.volumes = data.volumes;
        })
        .finally(() => (this.loading = false));
    },
    handleBack(volume_id: number, volume: Volume) {
      trpc
        .mutation("volumes.back", {
          volume_id,
        })
        .then(() => {
          this.volumes = this.volumes.filter((volume) => volume.volume_id !== volume_id);

          // 返却の場合、投稿を書くか？
          if (volume.status === "LENDING") {
            $dialog
              .open({
                colorset: "info",
                icon: "bx:info-circle",
                message: "このまま投稿を書きますか？",
                confirmText: "YES",
                cancelText: "NO",
              })
              .then(() => {
                this.$router.push({ path: `/drafts/new`, query: { book_id: volume.book_id } });
              });
          }
        });
    },
  },
});
</script>
