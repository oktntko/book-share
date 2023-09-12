<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import SearchBook from '~/pages/book/components/SearchBook.vue';
import ModalAddReadingrecord from '~/pages/mypage/readingrecord/components/ModalAddReadingrecord.vue';
import { openModal } from '~/utils/ProgrammaticComponentHelper';

const volume = ref<RouterOutput['book']['getVolume']>();
const p = ref({ pageX: 0, pageY: 0 });

function handleSelected(book: RouterOutput['book']['getVolume'], e: PointerEvent) {
  volume.value = undefined;
  setTimeout(() => {
    volume.value = book;
    p.value = e;
  }, 100);
}
</script>

<template>
  <div class="mb-8">
    <SearchBook class="container mx-auto my-4" @selected="handleSelected"></SearchBook>

    <OnClickOutside
      as="div"
      class="absolute"
      :style="{ left: `${p.pageX}px`, top: `${p.pageY}px` }"
      @trigger="() => (volume = undefined)"
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
          v-if="volume"
          class="absolute left-0 z-50 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabindex="-1"
        >
          <div role="none">
            <a
              class="block cursor-pointer border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
              @click="
                () => {
                  openModal({
                    component: ModalAddReadingrecord,
                    componentProps: {
                      volume_id: volume?.id ?? '',
                      book_title: volume?.volumeInfo?.title ?? '',
                    },
                    componentEvents: {},
                  });
                  volume = undefined;
                }
              "
            >
              本を読んだ
              <p class="text-xs text-gray-400">読書の記録をつけましょう！</p>
            </a>
            <RouterLink
              :to="{
                path: `/`,
                query: { book_id: volume.id },
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
                path: `/mypage/post/add`,
                query: { book_id: volume?.id },
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
