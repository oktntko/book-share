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
              :to="`/library/${row.volume_id}`"
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
          this.total = data.total;
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
          this.total--;
        })
        .finally(() => (this.loading = false));
    },
  },
});
</script>
