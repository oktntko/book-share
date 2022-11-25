<template>
  <div>
    <form class="flex flex-col gap-2" @submit.prevent>
      <!-- 選択した本 -->
      <div v-show="book" class="relative">
        <BookVue class="rounded border bg-gray-100" :book="book" :hoverable="false"> </BookVue>
        <div class="absolute top-4 right-4">
          <div class="flex gap-4">
            <button
              type="button"
              class="inline-flex items-center rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
              @click="openVolumesSearchVue"
            >
              <Icon icon="flat-color-icons:search" class="mr-2 -ml-1 h-5 w-5"></Icon>
              <p>本を探す</p>
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-lg border border-gray-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
              aria-label="Close"
              @click="handleClear"
            >
              <Icon icon="bi:x" class="mr-2 -ml-1 h-5 w-5"></Icon>
              <p>リセット</p>
            </button>
          </div>
        </div>
      </div>
      <!-- 本が選択されなかったときは、本を探してほしいメッセージ -->
      <div
        v-show="!book"
        class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300"
        role="alert"
      >
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">投稿を書く本を見つけましょう！</h3>
        </div>
        <div class="mt-2 mb-4 text-sm text-blue-900">
          本を選ぶと、あなたの投稿を見つけやすくなります。
        </div>
        <div class="flex">
          <button
            type="button"
            class="inline-flex items-center rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
            @click="openVolumesSearchVue"
          >
            <Icon icon="flat-color-icons:search" class="mr-2 -ml-1 h-5 w-5"></Icon>
            <p>本を探す</p>
          </button>
        </div>
      </div>

      <!-- タイトル -->
      <div class="relative">
        <input
          id="floating_outlined"
          v-model="form.post_title"
          type="text"
          class="peer block w-full appearance-none border border-gray-300 bg-white px-2.5 pb-2.5 pt-4 focus:border-blue-600 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          for="floating_outlined"
          class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          タイトル
        </label>
      </div>
      <!-- エディタ -->
      <Editor v-model="form.content"></Editor>
      <!-- フッター -->
      <footer class="flex justify-start gap-4">
        <button
          type="button"
          class="inline-flex min-w-[120px] justify-center rounded-lg border border-green-800 bg-green-100 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-green-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          @click="handleSubmit"
        >
          <Icon icon="entypo:save" class="mr-2 -ml-1 h-5 w-5"> </Icon>
          保存する
        </button>
        <button
          v-if="post_id"
          type="button"
          class="inline-flex min-w-[120px] justify-center rounded-lg border border-blue-800 bg-blue-100 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          @click="handlePublish"
        >
          <Icon
            :icon="`${form.published ? 'bxs:lock' : 'bxs:lock-open-alt'}`"
            class="mr-2 -ml-1 h-5 w-5"
          >
          </Icon>
          {{ form.published ? "非公開にする" : "公開する" }}
        </button>
      </footer>
    </form>
  </div>
</template>

<script lang="ts">
import equal from "fast-deep-equal";
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { $dialogThreeButton } from "~/components/DialogThreeButton.vue";
import Editor from "~/components/Editor.vue";
import { $loading } from "~/components/Loading.vue";
import { $modal } from "~/components/Modal.vue";
import { $toast } from "~/components/Toast.vue";
import { clone } from "~/libs/just/collection-clone";
import { Book, trpc } from "~/libs/trpc";
import BookVue from "~/pages/books/components/Book.vue";
import SearchBooksVue from "~/pages/books/components/SearchBooks.vue";

export default Vue.extend({
  components: {
    BookVue,
    Editor,
  },
  props: {
    post_id: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  data() {
    const book_id = typeof this.$route.query.book_id === "string" ? this.$route.query.book_id : "";

    return {
      book: undefined as Book | undefined,
      form: {
        book_id,
        book_title: "",
        post_title: "",
        content: "",
        published: false,
      },
      orig: {
        book_id,
        book_title: "",
        post_title: "",
        content: "",
        published: false,
      },
    };
  },
  created() {
    const promise = this.post_id
      ? // 編集の時
        this.getDraft(this.post_id)
      : this.form.book_id
      ? // 本を選んでから投稿を書くとき
        this.getBook(this.form.book_id)
      : Promise.resolve();
    // 登録の時は何もしない

    // 表示のデータを保存しておく
    promise.then(() => {
      this.orig = clone(this.form);
    });
  },
  methods: {
    handleSubmit() {
      const promise = this.post_id ? this.updateDraft(this.post_id) : this.createDraft();
      promise.then((data) => {
        // TODO:
        // 更新時のローディンク作成
        // 更新時のローディンク破棄
        // トースト表示
        // 遷移先のローディンク作成
        // 遷移先のローディンク破棄
        // になるので、トーストが若干ぼやける
        $toast.open({
          type: "success",
          message: "保存に成功しました。",
        });
        // 登録の時
        if (!this.post_id) {
          $dialog
            .open({
              colorset: "info",
              icon: "bx:info-circle",
              message: "このまま投稿を公開しますか？",
              confirmText: "YES",
              cancelText: "NO",
            })
            .then(() => {
              this.poublishDraft(data.post_id, true);
            });
        } else {
          this.$router.push("/drafts");
        }
      });
    },
    handleClear() {
      this.form.book_id = "";
      this.form.book_title = "";
      this.book = undefined;
    },
    handleSelect(book: Book) {
      this.form.book_id = book.book_id;
      this.form.book_title = book.book_title;
      this.book = book;
    },
    getDraft(post_id: number) {
      const loading = $loading.open();
      return trpc
        .query("drafts.get", { post_id })
        .then((data) => {
          this.form = {
            book_id: data.book?.book_id ?? "",
            book_title: data.book?.book_title ?? "",
            post_title: data.post_title,
            content: data.content,
            published: data.published,
          };

          this.book = data.book;
        })
        .finally(loading.close);
    },
    createDraft() {
      const loading = $loading.open();
      return trpc.mutation("drafts.create", this.form).finally(loading.close);
    },
    updateDraft(post_id: number) {
      const loading = $loading.open();
      return trpc.mutation("drafts.update", { post_id, ...this.form }).finally(loading.close);
    },
    poublishDraft(post_id: number, publish: boolean) {
      return trpc.mutation("drafts.publish", { post_id, publish }).then(() => {
        $toast.open({
          type: "success",
          message: `投稿を${publish ? "公開" : "非公開に"}しました。`,
        });
        this.$router.push("/drafts");
      });
    },
    getBook(book_id: string) {
      const loading = $loading.open();
      return trpc
        .query("books.get", {
          book_id,
        })
        .then((book) => {
          this.book = book;
        })
        .finally(loading.close);
    },
    openVolumesSearchVue() {
      $modal.open({
        component: SearchBooksVue,
        container: true,
        componentEvents: {
          selected: (book: Book) => {
            this.handleSelect(book);
          },
        },
      });
    },
    handlePublish() {
      if (!equal(this.form, this.orig)) {
        $dialogThreeButton.open({
          message: "変更があります。変更を保存しますか？",
          confirmText: `変更を保存して${this.orig.published ? "非公開" : "公開"}`,
          confirm: () => {
            this.updateDraft(this.post_id).then(() => {
              this.poublishDraft(this.post_id, !this.orig.published);
            });
          },
          cancelConfirmText: `変更を破棄して${this.orig.published ? "非公開" : "公開"}`,
          cancelConfirm: () => {
            this.poublishDraft(this.post_id, !this.orig.published);
          },
        });
      } else {
        this.poublishDraft(this.post_id, !this.orig.published);
      }
    },
  },
});
</script>
