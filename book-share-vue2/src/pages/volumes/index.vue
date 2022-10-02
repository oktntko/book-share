<template>
  <div class="container mx-auto p-4">
    <nav class="mb-4 flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <Icon icon="mdi:bookshelf" class="h-5 w-5"></Icon>
        </li>
        <li class="inline-flex items-center">
          <RouterLink
            to="/volumes"
            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400"
            exact
            active-class="text-blue-600 font-bold"
          >
            貸出中の本一覧
          </RouterLink>
        </li>
        <li class="inline-flex items-center">
          <RouterLink
            to="/volumes/new"
            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400"
            exact
            active-class="text-blue-600 font-bold"
          >
            本を貸し出す
          </RouterLink>
        </li>
      </ol>
    </nav>

    <!-- 検索フォーム -->
    <form class="mb-4 flex flex-col gap-2" @submit.prevent="handleSubmit">
      <!-- 一段目 -->
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
      <VxeTable
        :loading="loading"
        :height="loading ? 300 : undefined"
        border
        resizable
        :data="volumes"
      >
        <vxe-column field="volume_id" width="80" title="ID" align="right" sortable>
          <template #default="{ row }">
            <RouterLink
              :to="`/volumes/${row.volume_id}`"
              class="border-b-4 border-b-transparent text-blue-600"
            >
              {{ `#${row.volume_id}` }}
            </RouterLink>
          </template>
        </vxe-column>
        <vxe-column field="status" width="80" title="状態" sortable>
          <template #default="{ row }">
            <div
              v-if="row.status === 'STOCK'"
              class="leading-sm inline-flex items-center rounded-2xl bg-green-200 px-3 py-1 text-xs font-bold uppercase text-green-700"
            >
              在庫
            </div>
            <div
              v-else-if="row.status === 'LENDING'"
              class="leading-sm inline-flex items-center rounded-2xl bg-pink-200 px-3 py-1 text-xs font-bold uppercase text-pink-700"
            >
              貸出中
            </div>
          </template>
        </vxe-column>
        <vxe-column field="bookshelf" title="本棚" sortable></vxe-column>
        <vxe-column field="book.book_title" title="タイトル" sortable></vxe-column>
        <vxe-column field="owner.username" title="所有者" sortable>
          <template #default="{ row }">
            <div v-if="row.owner">{{ row.owner.username }}</div>
            <div
              v-else
              class="leading-sm inline-flex items-center rounded-2xl bg-gray-200 px-3 py-1 text-xs font-bold uppercase text-gray-700"
            >
              不明
            </div>
          </template>
        </vxe-column>
        <vxe-column field="borrower.username" title="借りている人" sortable></vxe-column>
        <vxe-column
          field="created_at"
          title="登録日時"
          sortable
          formatter="formatDatetime"
          width="160"
        ></vxe-column>
        <template #empty>
          <div
            class="border-t border-b border-yellow-500 bg-yellow-100 px-4 py-3 text-yellow-700"
            role="alert"
          >
            <p class="font-bold">該当するデータが見つかりません</p>
          </div>
        </template>
      </VxeTable>
      <vxe-pager
        perfect
        :loading="loading"
        :current-page="pager.currentPage"
        :page-size="pager.pageSize"
        :total="pager.total"
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
      </vxe-pager>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { trpc, Volume, VolumeQuery } from "~/libs/trpc";

export default Vue.extend({
  data() {
    return {
      search: {} as VolumeQuery,
      volumes: [] as Volume[],
      loading: true,
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.listVolumes();
  },
  methods: {
    handleSubmit() {
      this.listVolumes();
    },
    handleDelete(volume: Volume) {
      $dialog
        .open({
          colorset: "danger",
          icon: "bx:error",
          message: `本の貸し出しを終了します。よろしいですか？`,
        })
        .then(() => {
          this.deleteVolume(volume.volume_id);
        });
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
          sort: ["created_at"],
          limit: this.pager.pageSize,
          offset: this.pager.pageSize * (this.pager.currentPage - 1),
        })
        .then((data) => {
          this.pager.total = data.total;
          this.volumes = data.volumes;
        })
        .finally(() => (this.loading = false));
    },
    deleteVolume(volume_id: number) {
      this.loading = true;
      return trpc
        .mutation("volumes.delete", { volume_id })
        .then(() => {
          this.volumes = this.volumes.filter((volume) => volume.volume_id !== volume_id);
          this.pager.total--;
        })
        .finally(() => (this.loading = false));
    },
  },
});
</script>
