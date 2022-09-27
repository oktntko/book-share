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

    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <!-- 選択した本 -->
      <div v-show="volume" class="relative">
        <VolumeVue :volume="volume"> </VolumeVue>
        <div class="absolute top-4 right-4">
          <div class="flex">
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
        v-show="!volume"
        class="border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300"
        role="alert"
      >
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">あなたの本を見つけましょう！</h3>
        </div>
        <div class="mt-2 mb-4 text-sm text-blue-900">
          本が見つからない？何としても見つけてください。
        </div>
        <div class="flex">
          <button
            type="button"
            class="rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
            aria-label="Close"
            @click="openVolumesSearchVue"
          >
            本を探す
          </button>
        </div>
      </div>

      <div class="relative">
        <input
          id="floating_outlined"
          v-model="form.bookshelf"
          type="text"
          class="peer block w-full appearance-none border border-gray-300 bg-white px-2.5 pb-2.5 pt-4 focus:border-blue-600 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          for="floating_outlined"
          class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          本がある場所(本棚)
        </label>
      </div>

      <div class="flex">
        <div class="mr-4 flex items-center">
          <p>この本はあなたの本ですか？</p>
        </div>
        <div class="mr-4 flex items-center">
          <input
            id="radio-ME"
            v-model="form.owner"
            type="radio"
            value="ME"
            name="inline-radio-group"
            class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label for="radio-ME" class="ml-2 font-medium"> はい、私の本です </label>
        </div>
        <div class="mr-4 flex items-center">
          <input
            id="radio-UNKNOWN"
            v-model="form.owner"
            type="radio"
            value="UNKNOWN"
            name="inline-radio-group"
            class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label for="radio-UNKNOWN" class="ml-2 font-medium"> いいえ、持ち主はわかりません </label>
        </div>
      </div>

      <!-- フッター -->
      <footer class="flex justify-end">
        <button
          type="button"
          class="inline-flex min-w-[120px] justify-center rounded-lg border border-green-800 bg-green-100 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-green-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          @click="handleSubmit"
        >
          <Icon icon="entypo:save" class="mr-2 -ml-1 h-5 w-5"> </Icon>
          保存する
        </button>
      </footer>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { $loading } from "~/components/Loading.vue";
import { $modal } from "~/components/Modal.vue";
import { $toast } from "~/components/Toast.vue";
import VolumeVue from "~/components/Volume.vue";
import VolumesSearchVue, { Volume } from "~/components/VolumesSearch.vue";
import { axios } from "~/libs/axios";
import { trpc, VolumeInput } from "~/libs/trpc";

export default Vue.extend({
  components: {
    VolumeVue,
  },
  props: {
    volume_id: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  data() {
    const google_id =
      typeof this.$route.query.google_id === "string" ? this.$route.query.google_id : undefined;

    return {
      volume: undefined as Volume | undefined,
      form: {
        google_id,
        owner: "ME" as "ME" | "UNKNOWN",
        bookshelf: "",
      },
    };
  },
  created() {
    if (this.volume_id) {
      // 編集の時
      this.getVolume(this.volume_id).then(() => {
        if (this.form.google_id) {
          return this.getGoogleBook(this.form.google_id);
        }
      });
    } else if (this.form.google_id) {
      // 本を選んでから投稿を書くとき
      this.getGoogleBook(this.form.google_id);
    }
  },
  methods: {
    handleSubmit() {
      if (!this.form.google_id) {
        this.openInvalidInputWarningDialog();
        return;
      }

      const promise = this.volume_id
        ? this.updateVolume(this.volume_id, {
            google_id: this.form.google_id,
            owner: this.form.owner,
            bookshelf: this.form.bookshelf,
          })
        : this.createVolume({
            google_id: this.form.google_id,
            owner: this.form.owner,
            bookshelf: this.form.bookshelf,
          });

      if (promise) {
        promise.then(() => {
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

          this.$router.push("/volumes");
        });
      }
    },
    handleClear() {
      this.form.google_id = "";
      this.volume = undefined;
    },
    handleSelect(google_id: string, volume: Volume) {
      this.form.google_id = google_id;
      this.volume = volume;
    },
    getVolume(volume_id: number) {
      const loading = $loading.open();
      return trpc
        .query("volumes.get", { volume_id })
        .then((data) => {
          this.form = {
            google_id: data.book.google_id,
            owner: data.owner?.user_id ? "ME" : "UNKNOWN",
            bookshelf: data.bookshelf,
          };
        })
        .finally(loading.close);
    },
    createVolume(form: VolumeInput) {
      const loading = $loading.open();
      return trpc.mutation("volumes.create", form).finally(loading.close);
    },
    updateVolume(volume_id: number, form: VolumeInput) {
      const loading = $loading.open();
      return trpc
        .mutation("volumes.update", {
          volume_id,
          ...form,
        })
        .finally(loading.close);
    },
    getGoogleBook(google_id: string) {
      const loading = $loading.open();
      // https://developers.google.com/books/docs/v1/reference/volumes/get
      return axios
        .get<Volume>(`https://www.googleapis.com/books/v1/volumes/${google_id}`)
        .then(({ data }) => {
          this.volume = data;
        })
        .finally(loading.close);
    },
    openVolumesSearchVue(close: () => void = () => ({})) {
      $modal.open({
        component: VolumesSearchVue,
        container: true,
        componentEvents: {
          selected: (google_id: string, volume: Volume) => {
            this.handleSelect(google_id, volume);
          },
          close,
        },
      });
    },
    // .コピペ
    openInvalidInputWarningDialog() {
      $dialog.open({
        icon: "ant-design:warning-twotone",
        colorset: "warning",
        message: "本が選択されていませんよ？冗談を言っている場合じゃないでしょう。",
        canCancel: {
          escape: true,
          button: false,
          outside: true,
        },
      });
    },
  },
});
</script>
