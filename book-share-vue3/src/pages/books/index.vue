<script lang="ts">
import { defineComponent } from "vue";
import { OnClickOutside } from "@vueuse/components";
import type { Book } from "~/middleware/trpc";
import SearchBooksVue from "~/pages/books/components/SearchBooks.vue";

export default defineComponent({
  components: {
    OnClickOutside,
    SearchBooksVue,
  },
  data() {
    return {
      book_id: "",
      book: undefined as Book | undefined,
      pageX: 0,
      pageY: 0,
    };
  },
  methods: {
    handleClear() {
      this.book = undefined;
      this.book_id = "";
    },
    handleSelect(book: Book, e: PointerEvent) {
      if (this.book === undefined) {
        this.book_id = book.book_id;
        this.book = book;
        this.pageX = e.pageX;
        this.pageY = e.pageY;
      } else {
        this.handleClear();
        setTimeout(() => {
          this.book_id = book.book_id;
          this.book = book;
          this.pageX = e.pageX;
          this.pageY = e.pageY;
        }, 100);
      }
    },
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <SearchBooksVue :on-dialog="false" :book_id="book_id" @selected="handleSelect">
    </SearchBooksVue>
    <OnClickOutside
      as="div"
      class="absolute"
      :style="{ left: `${pageX}px`, top: `${pageY}px` }"
      @trigger="handleClear"
    >
      <Transition
        enter-from-class="transform opacity-0 scale-95"
        enter-active-class="transition ease-out duration-100"
        enter-to-class="transform opacity-100 scale-100"
        leave-from-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-show="book"
          class="absolute left-0 z-50 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <RouterLink
              :to="{
                path: `/posts`,
                query: { book_id },
              }"
              class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              exact
              active-class="text-blue-600 border-l-gray-200"
            >
              投稿を探す
              <p class="text-xs text-gray-400">いい本にはいい投稿があります！</p>
            </RouterLink>
            <RouterLink
              :to="{
                path: `/library`,
                query: { book_id },
              }"
              class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              exact
              active-class="text-blue-600 border-l-gray-200"
            >
              図書館から本を借りる
              <p class="text-xs text-gray-400">本を読みましょう！</p>
            </RouterLink>
            <RouterLink
              :to="{
                path: `/drafts/new`,
                query: { book_id },
              }"
              class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              exact
              active-class="text-blue-600 border-l-gray-200"
            >
              投稿を書く
              <p class="text-xs text-gray-400">本を読んだら投稿を書こう！</p>
            </RouterLink>
          </div>
        </div>
      </Transition>
    </OnClickOutside>
  </div>
</template>
