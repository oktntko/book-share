<template>
  <div class="container mx-auto p-4">
    <form class="flex flex-col gap-2">
      <!-- 初回の本の検索ダイアログ表示中は表示が被るので非表示 -->
      <template v-if="openingFirstVolumesSearchVue"> </template>
      <!-- 選択した本 -->
      <template v-else-if="volume">
        <div class="relative">
          <VolumeVue :volume="volume"> </VolumeVue>
          <div class="absolute top-4 right-4">
            <div class="flex">
              <button
                type="button"
                class="inline-flex items-center rounded-lg border border-gray-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
                data-dismiss-target="#alert-additional-content-1"
                aria-label="Close"
                @click="handleClear"
              >
                <Icon icon="bi:x" class="mr-2 -ml-1 h-5 w-5"></Icon>
                <p>リセット</p>
              </button>
            </div>
          </div>
        </div>
      </template>
      <!-- 本が選択されなかったときは、本を探してほしいメッセージ -->
      <template v-else>
        <div
          id="alert-additional-content-1"
          class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300"
          role="alert"
        >
          <div class="flex items-center">
            <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
            <span class="sr-only">Info</span>
            <h3 class="text-lg font-medium text-blue-900">投稿を書く本を見つけましょう！</h3>
          </div>
          <div class="mt-2 mb-4 text-sm text-blue-900">
            本を選ぶと、あなたの投稿を見つけやすくなります。<br />スキップすることもできます。
          </div>
          <div class="flex">
            <button
              type="button"
              class="rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
              data-dismiss-target="#alert-additional-content-1"
              aria-label="Close"
              @click="openVolumesSearchVue"
            >
              本を探す
            </button>
          </div>
        </div>
      </template>

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
      <Editor
        v-model="form.content"
        class="h-full"
        api-key="no-api-key"
        :disabled="false"
        :init="{
          height: 792,
          max_height: 792,
          resize: true,
          menubar: false,
        }"
        :plugins="[
          'a11ychecker',
          'advlist',
          'advcode',
          'advtable',
          'autolink',
          'checklist',
          'export',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'powerpaste',
          'fullscreen',
          'formatpainter',
          'insertdatetime',
          'media',
          'table',
          'help',
          'wordcount',
        ]"
        toolbar="undo redo | casechange blocks | bold italic backcolor |
          alignleft aligncenter alignright alignjustify |
          bullist numlst checklist outdent indent | removeformat | a11ycheck code table help"
        output-format="html"
      >
      </Editor>
      <!-- フッター -->
      <footer class="flex justify-end">
        <button
          type="button"
          class="inline-flex min-w-[120px] justify-center rounded-lg border border-green-800 bg-green-100 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-green-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          @click="submit"
        >
          <Icon icon="entypo:save" class="mr-2 -ml-1 h-5 w-5"> </Icon>
          保存する
        </button>
      </footer>
    </form>
  </div>
</template>

<script lang="ts">
import Editor from "@tinymce/tinymce-vue";
import Vue from "vue";
import { $loading } from "~/components/Loading.vue";
import { $modal } from "~/components/Modal.vue";
import VolumeVue from "~/components/Volume.vue";
import VolumesSearchVue, { Volume } from "~/components/VolumesSearch.vue";
import { trpc } from "~/libs/trpc";

export default Vue.extend({
  components: {
    Editor,
    VolumeVue,
  },
  data() {
    const google_id =
      typeof this.$route.query.google_id === "string" ? this.$route.query.google_id : undefined;

    return {
      openingFirstVolumesSearchVue: true,
      volume: undefined as Volume | undefined,
      form: {
        post_title: "",
        content: "",
        google_id,
      },
    };
  },
  created() {
    this.openVolumesSearchVue(() => (this.openingFirstVolumesSearchVue = false));
  },
  methods: {
    submit() {
      const loading = $loading.open();
      trpc.mutation("posts.create", this.form).finally(loading.close);
    },
    handleClear() {
      this.form.google_id = "";
      this.volume = undefined;
    },
    handleSelect(google_id: string, volume: Volume) {
      this.form.google_id = google_id;
      this.volume = volume;
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
  },
});
</script>

<style>
/* TODO 開発中のみ tinymce ダイアログを消す */
.tox.tox-silver-sink.tox-tinymce-aux {
  position: unset !important;
}
</style>
