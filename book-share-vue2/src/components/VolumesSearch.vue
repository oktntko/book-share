<template>
  <div class="flex flex-col gap-4 bg-gray-50 p-6 text-gray-600">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <!-- 一段目 -->
      <div class="flex justify-between">
        <!-- ラジオボタン -->
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
        <!-- やめるボタン -->
        <div class="flex">
          <button
            type="button"
            class="inline-flex items-center rounded-lg border border-gray-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-gray-800 dark:text-gray-800 dark:hover:text-white"
            aria-label="Close"
            @click="handleClose"
          >
            <Icon icon="bi:x" class="mr-2 -ml-1 h-5 w-5"></Icon>
            <p>やめる</p>
          </button>
        </div>
      </div>
      <!-- 検索フォーム -->
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
    <!-- 検索結果がある場合 -->
    <template v-if="pager.total > 0">
      <div class="masonry-wrapper">
        <div
          v-for="volume of volumes"
          :key="volume.id"
          class="masonry-item cursor-pointer py-4 px-2"
          @click="handleSelect(volume)"
        >
          <div
            class="flex flex-col gap-2 rounded border-b border-r bg-gray-100 p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform hover:bg-white hover:drop-shadow"
          >
            <div class="flex gap-4">
              <!-- サムネイル -->
              <img
                v-if="
                  volume.volumeInfo &&
                  volume.volumeInfo.imageLinks &&
                  volume.volumeInfo.imageLinks.thumbnail
                "
                class="h-[182px] w-[128px] rounded object-cover object-center"
                :src="volume.volumeInfo.imageLinks.thumbnail"
                alt="content"
              />
              <!-- サムネイルがなかった時のダミー画像 -->
              <img
                v-else
                class="h-[182px] w-[128px] rounded object-cover object-center"
                src="https://dummyimage.com/128x182"
                alt="content"
              />
              <!-- 本の情報 -->
              <div class="hidden flex-col gap-1 lg:flex">
                <h3
                  v-if="volume.volumeInfo.authors"
                  class="title-font text-xs text-blue-500 transition-colors hover:text-blue-900 hover:underline"
                >
                  {{ volume.volumeInfo.authors.join(", ") }}
                </h3>
                <h2
                  v-if="volume.volumeInfo.title"
                  class="title-font text-lg font-bold text-gray-900"
                >
                  {{ volume.volumeInfo.title }}
                </h2>
                <h2 v-if="volume.volumeInfo.subtitle" class="title-font text-sm text-gray-600">
                  {{ volume.volumeInfo.subtitle }}
                </h2>
                <span
                  v-if="volume.volumeInfo.publishedDate"
                  class="title-font text-xs text-gray-600"
                >
                  {{ volume.volumeInfo.publishedDate }}
                </span>
                <span v-if="volume.volumeInfo.publisher" class="title-font text-xs text-gray-600">
                  {{ volume.volumeInfo.publisher }}
                </span>
              </div>
            </div>
            <!-- 本の説明 -->
            <p class="line-clamp text-base leading-relaxed">
              {{ volume.volumeInfo.description }}
            </p>
            <footer class="flex items-center justify-end gap-2">
              <a
                v-if="volume.volumeInfo.infoLink"
                :href="volume.volumeInfo.infoLink"
                target="_blank"
                class="flex text-center text-sm font-medium capitalize text-blue-500 transition-colors hover:text-blue-900 hover:underline"
                @click.stop
              >
                google site
              </a>
              <a
                v-if="volume.volumeInfo.previewLink"
                :href="volume.volumeInfo.previewLink"
                target="_blank"
                class="flex text-center text-sm font-medium text-blue-500 transition-colors hover:text-blue-900 hover:underline"
                @click.stop
              >
                サンプル
              </a>
            </footer>
          </div>
        </div>
      </div>
      <VxePager
        class="!bg-transparent"
        background
        size="small"
        :current-page="pager.currentPage"
        :page-size="pager.pageSize"
        :total="pager.total"
        :page-sizes="[10, 20, 30, 40]"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      ></VxePager>
    </template>
    <template v-else-if="pager.total === 0">
      <div
        class="mb-4 border-t-2 border-yellow-300 bg-yellow-50 p-4 dark:bg-yellow-200"
        role="alert"
      >
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-yellow-700"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-yellow-700 dark:text-yellow-800">
            一致する書籍が見つかりませんでした。
          </h3>
        </div>
        <div class="mt-4 mb-2 text-sm text-yellow-700 dark:text-yellow-800">
          <li>キーワードに誤字・脱字がないか確認します。</li>
          <li>別のキーワードを試してみます。</li>
          <li>もっと一般的なキーワードに変えてみます。</li>
          <li>キーワードの数を減らしてみます。</li>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300" role="alert">
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">検索のコツ</h3>
        </div>
        <div class="mt-4 mb-2 text-sm text-blue-700 dark:text-blue-800">
          <li>ヒント 1. まずはシンプルに</li>
          <li>ヒント 2. 音声で検索する</li>
          <li>ヒント 3. 検索語句を工夫する</li>
          <li>ヒント 4. 間違えてもだいじょうぶ</li>
          <li>ヒント 5. 便利な機能を利用する</li>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $loading } from "~/components/Loading.vue";
import { axios } from "~/libs/axios";

export type Volume = {
  // kind: "books#volume"; // Resource type for a volume. (In LITE projection.)
  // google_id
  id: string; // Unique identifier for a volume. (In LITE projection.)
  // etag: string; // Opaque identifier for a specific version of a volume resource. (In LITE projection)
  // Volume API のGET (ex) https://www.googleapis.com/books/v1/volumes/ke9XEAAAQBAJ
  selfLink: string; // URL to this resource. (In LITE projection.)
  volumeInfo: {
    // General volume information.
    title: string; // Volume title. (In LITE projection.)
    subtitle: string; // Volume subtitle. (In LITE projection.)
    authors: string[]; // The names of the authors and/or editors for this volume. (In LITE projection)
    publisher: string; // Publisher of this volume. (In LITE projection.)
    publishedDate: string; // Date of publication. (In LITE projection.)
    description: string; // A synopsis of the volume. The text of the description is formatted in HTML and includes simple formatting elements, such as b, i, and br tags. (in LITE projection)
    contentVersion: string; // An identifier for the version of the volume content (text & images). (In LITE projection)
    infoLink: string; // URL to view information about this volume on the Google Books site. (In LITE projection)
    // canonicalVolumeLink: string; // Canonical URL for a volume. (In LITE projection.)
    previewLink: string; // URL to preview this volume on the Google Books site.
    imageLinks?: {
      // A list of image links for all the sizes that are available. (in LITE projection)
      thumbnail: string; // Image link for thumbnail size (width of ~128 pixels). (in LITE projection)
      smallThumbnail: string; // Image link for small thumbnail size (width of ~80 pixels). (in LITE projection)
      small?: string; // Image link for small size (width of ~300 pixels). (in LITE projection)
      medium?: string; // Image link for medium size (width of ~575 pixels). (in LITE projection)
      large?: string; // Image link for large size (width of ~800 pixels). (in LITE projection)
      extraLarge?: string; // Image link for extra large size (width of ~1280 pixels). (in LITE projection)
    };
    saleInfo: {
      // Any information about a volume related to the eBookstore and/or purchaseability. This information can depend on the country where the request originates from (i.e. books may not be for sale in certain countries).
      // buyLink: string; // URL to purchase this volume on the Google Books site. (in LITE projection)
      country: string; // The two-letter ISO_3166-1 country code for which this sale information is valid. (In LITE projection.)
      listPrice: {
        // Suggested retail price. (in LITE projection)
        amount: number; // Amount in the currency listed below. (In LITE projection.)
        currencyCode: string; // An ISO 4217, three-letter currency code. (In LITE projection.)
      };
      retailPrice: {
        // The actual selling price of the book. This is the same as the suggested retail or list price unless there are offers or discounts on this volume. (in LITE projection)
        amount: number; // Amount in the currency listed below. (In LITE projection.)
        currencyCode: string; // An ISO 4217, three-letter currency code. (In LITE projection.)
      };
    };
    accessInfo: {
      // Any information about a volume related to reading or obtaining that volume text. This information can depend on country (books may be public domain in one country but not in another, e.g.).
      accessViewStatus: string; // Combines the access and viewability of this volume into a single status field for this user. Values can be FULL_PURCHASED, FULL_PUBLIC_DOMAIN, SAMPLE or NONE. (In LITE projection.)
      country: string; // The two-letter ISO_3166-1 country code for which this access information is valid. (In LITE projection.)
      epub: {
        // Information about epub content. (in LITE projection)
        downloadLink: string; // URL to download epub. (In LITE projection.)
        acsTokenLink: string; // URL to retrieve ACS token for epub download. (In LITE projection.)
        isAvailable: boolean; // Is a flowing text epub available either as public domain or for purchase. (In LITE projection.)
      };
      pdf: {
        // Information about pdf content. (in LITE projection)
        downloadLink: string; // URL to download pdf. (In LITE projection.)
        acsTokenLink: string; // URL to retrieve ACS token for pdf download. (In LITE projection.)
        isAvailable: boolean; // Is a scanned image pdf available either as public domain or for purchase. (In LITE projection.)
      };
    };
    searchInfo: {
      // Search result information related to this volume.
      textSnippet: string; // A text snippet containing the search query.
    };
  };
};

export default Vue.extend({
  data() {
    return {
      search: {
        queryfield: "",
        keyword: "",
      },
      fields: Object.entries({
        "": "すべて",
        intitle: "タイトル",
        inauthor: "著者",
        inpublisher: "発行元",
        subject: "カテゴリ",
      }),
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: undefined as number | undefined,
      },
      volumes: [] as Volume[],
    };
  },
  methods: {
    handleSubmit() {
      this.pager.currentPage = 1;
      this.listGoogleBooks(this.search.keyword, this.search.queryfield);
    },
    handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.listGoogleBooks(this.search.keyword, this.search.queryfield);
    },
    handleClose() {
      this.$emit("close");
    },
    handleSelect(volume: Volume) {
      this.$emit("selected", volume.id, volume);
      this.$emit("close");
    },
    listGoogleBooks(keyword: string, queryfield: string) {
      const loading = $loading.open();
      // https://developers.google.com/books/docs/v1/reference/volumes/list
      axios
        .get<{
          totalItems: number;
          items: Volume[];
        }>("https://www.googleapis.com/books/v1/volumes", {
          params: {
            q: queryfield ? `${queryfield}:${keyword}` : keyword,
            startIndex: (this.pager.currentPage - 1) * this.pager.pageSize,
            maxResults: this.pager.pageSize,
            orderBy: "relevance", // "newest|relevance"
          },
        })
        .then(({ data }) => {
          this.pager.total = data.totalItems;
          this.volumes = data.items;
        })
        .finally(loading.close);
    },
  },
});
</script>

<style scoped>
.masonry-wrapper {
  column-count: 4;
}

.masonry-wrapper .masonry-item {
  break-inside: avoid;
}

.line-clamp {
  margin: 1rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
}
</style>
