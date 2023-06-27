<script lang="ts">
import { defineComponent } from "vue";
import { trpc, Volume } from "~/middleware/trpc";
import LibraryNavVue from "~/pages/library/components/LibraryNav.vue";

export default defineComponent({
  components: { LibraryNavVue },
  data() {
    return {
      volumes: [] as Volume[],
      loading: true,
      pager: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
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
          created_by: "IAM",
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
  },
});
</script>

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
        <VxeColumn field="volume_id" title="ID" sortable width="80" align="right">
          <template #default="{ row }">
            <div class="inline-flex">
              <RouterLink
                :to="`/library/${row.volume_id}`"
                class="text-blue-500 transition-colors hover:text-blue-900 hover:underline"
                exact
                active-class="text-blue-600 border-l-gray-200"
              >
                #{{ row.volume_id }}
              </RouterLink>
            </div>
          </template>
        </VxeColumn>
        <VxeColumn field="status" width="200" title="状態" sortable>
          <template #default="{ row }">
            <div class="inline-flex">
              <template v-if="row.status === 'LENDING'">
                <div
                  class="leading-sm mr-3 inline-flex items-center rounded-2xl bg-gray-200 px-3 py-1 text-xs font-bold uppercase text-gray-700"
                >
                  貸出中
                </div>
                <div class="flex flex-col">
                  <span class="-my-2 text-[0.5rem]">貸出中</span>
                  <span>{{ row.borrow_date }}</span>
                </div>
              </template>
              <!-- STOCK -->
              <template v-else>
                <div
                  class="leading-sm mr-3 inline-flex items-center rounded-2xl bg-green-200 px-3 py-1 text-xs font-bold uppercase text-green-700"
                >
                  在庫あり
                </div>
              </template>
            </div>
          </template>
        </VxeColumn>
        <VxeColumn field="book.book_title" title="タイトル" sortable> </VxeColumn>
        <VxeColumn field="bookshelf" width="200" title="本棚" sortable></VxeColumn>
        <VxeColumn title="所有者" width="104" sortable>
          <template #default="{ row }">
            <div
              :class="`leading-sm mr-3 inline-flex items-center rounded-2xl  px-3 py-1 text-xs font-bold uppercase
                ${row.owner_id ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'}`"
            >
              {{ row.owner_id ? "自分" : "不明" }}
            </div>
          </template>
        </VxeColumn>
        <template #empty>
          <div
            class="border-b border-t border-yellow-500 bg-yellow-100 px-4 py-3 text-yellow-700"
            role="alert"
          >
            <p class="font-bold">眠っている本はありませんか？寄贈しましょう！</p>
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
