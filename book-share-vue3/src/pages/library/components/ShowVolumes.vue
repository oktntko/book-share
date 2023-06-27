<script lang="ts">
import Vue, { PropType } from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { BookVolume, trpc } from "~/middleware/trpc";
import BookVue from "~/pages/books/components/Book.vue";

export default defineComponent({
  components: {
    BookVue,
  },
  props: {
    bookVolume: {
      type: Object as PropType<BookVolume>,
      required: true,
    },
  },
  methods: {
    handleBorrow(volume_id: number) {
      $dialog
        .open({
          colorset: "info",
          icon: "bx:info-circle",
          message: "本を借ります。本を読んだら投稿を書いてBOOK を SHAREしましょう！",
        })
        .then(() => {
          trpc
            .mutation("volumes.borrow", {
              volume_id,
            })
            .then(() => {
              this.$emit("borrow");
              this.$emit("close");
            });
        });
    },
  },
});
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <BookVue :book="bookVolume.book" :hoverable="false">
      <template #header>
        <!-- ステータス -->
        <header class="mb-4 flex items-center gap-4 text-sm">
          <div
            :class="`leading-sm text inline-flex items-center rounded-2xl px-3 py-1 font-bold uppercase
              ${
                bookVolume.status === '借用中'
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
    </BookVue>

    <div v-if="bookVolume.status === '在庫あり' || bookVolume.status === '在庫なし'">
      <VxeTable border resizable :data="bookVolume.volumes">
        <VxeColumn field="status" width="200" title="状態" sortable>
          <template #default="{ row }">
            <!-- 自分が借りている -->
            <template v-if="row.borrower_id">
              <div
                class="leading-sm mr-3 inline-flex items-center rounded-2xl bg-blue-200 px-3 py-1 text-xs font-bold uppercase text-blue-700"
              >
                借用中
              </div>
              <div class="flex flex-col">
                <span class="-my-2 text-[0.5rem]">借用日</span>
                <span>{{ row.borrow_date }}</span>
              </div>
            </template>
            <!-- 自分が借りていない -->
            <template v-else>
              <div v-if="row.status === 'STOCK'" class="inline-flex">
                <div
                  class="leading-sm mr-3 inline-flex items-center rounded-2xl bg-green-200 px-3 py-1 text-xs font-bold uppercase text-green-700"
                >
                  在庫あり
                </div>
              </div>
              <div v-else class="inline-flex">
                <div
                  class="leading-sm mr-3 inline-flex items-center rounded-2xl bg-gray-200 px-3 py-1 text-xs font-bold uppercase text-gray-700"
                >
                  在庫なし
                </div>
                <div class="flex flex-col">
                  <span class="-my-2 text-[0.5rem]">貸出日</span>
                  <span>{{ row.borrow_date }}</span>
                </div>
              </div>
            </template>
          </template>
        </VxeColumn>
        <VxeColumn field="bookshelf" title="本棚" sortable></VxeColumn>
        <VxeColumn width="184">
          <template #default="{ row }">
            <template v-if="row.status === 'STOCK'">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="inline-flex w-20 items-center justify-center rounded-lg border border-blue-800 bg-transparent px-3 py-1 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
                  @click="handleBorrow(row.volume_id)"
                >
                  借りる
                </button>
              </div>
            </template>
          </template>
        </VxeColumn>
        <template #empty>
          <div
            class="border-b border-t border-yellow-500 bg-yellow-100 px-4 py-3 text-yellow-700"
            role="alert"
          >
            <p class="font-bold">該当するデータが見つかりません</p>
          </div>
        </template>
      </VxeTable>
    </div>
  </div>
</template>
