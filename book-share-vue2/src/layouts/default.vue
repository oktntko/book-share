<template>
  <div
    class="flex min-h-screen flex-col bg-gray-50 text-gray-600 antialiased dark:bg-gray-700 dark:text-white"
  >
    <!-- Header -->
    <header class="body-font">
      <div class="container mx-auto flex flex-col flex-wrap items-center px-4 pt-5 md:flex-row">
        <nav class="flex flex-wrap items-center gap-5 text-base md:ml-auto lg:w-2/5">
          <RouterLink
            to="/posts"
            class="border-b-4 border-b-transparent hover:text-blue-600"
            active-class="text-blue-600 border-b-gray-200"
          >
            投稿を読む
          </RouterLink>
          <RouterLink
            to="/books"
            class="border-b-4 border-b-transparent hover:text-blue-600"
            active-class="text-blue-600 border-b-gray-200"
          >
            本を探す
            <!-- 本を借りる・本を返す・本を貸し出す・投稿を書く・投稿を探す -->
          </RouterLink>
          <RouterLink
            to="/library"
            class="border-b-4 border-b-transparent hover:text-blue-600"
            active-class="text-blue-600 border-b-gray-200"
          >
            図書館に入る
          </RouterLink>
        </nav>
        <RouterLink
          to="/"
          class="order-first mb-4 flex items-center font-medium text-gray-900 md:mb-0 lg:order-none lg:w-1/5 lg:items-center lg:justify-center"
        >
          <Icon icon="noto-v1:books" class="h-10 w-10 rounded-full p-2 text-white"> </Icon>
          <span class="ml-3 text-xl">Book Share</span>
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-5 text-base lg:ml-0 lg:w-2/5 lg:justify-end">
          <!-- 検索 -->
          <form>
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
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="いろいろ検索"
                required
              />
            </div>
          </form>
          <!-- ベルマーク -->
          <button type="button">
            <Icon icon="mdi:bell" class="h-5 w-5"> </Icon>
          </button>
          <!-- アバター -->
          <!-- This example requires Tailwind CSS v2.0+ -->
          <div class="relative inline-block text-left">
            <button
              v-click-outside="() => (showMenu = false)"
              class="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
              @click.prevent="showMenu = !showMenu"
            >
              <span class="font-medium text-gray-600 dark:text-gray-300">JL</span>
            </button>

            <transition
              enter-class="transform opacity-0 scale-95"
              enter-active-class="transition ease-out duration-100"
              enter-to-class="transform opacity-100 scale-100"
              leave-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-show="showMenu"
                class="absolute right-0 z-50 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                tabindex="-1"
              >
                <div class="py-1" role="none">
                  <RouterLink
                    to="/"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    マイ本棚
                    <p class="text-xs text-gray-400">読書の記録、予約の確認はここから</p>
                  </RouterLink>
                  <RouterLink
                    to="/"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    ストックした投稿
                    <p class="text-xs text-gray-400">参考になった投稿を確認する</p>
                  </RouterLink>
                </div>
                <div class="py-1" role="none">
                  <RouterLink
                    to="/library"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    図書館から本を借りる
                  </RouterLink>
                  <RouterLink
                    to="/library/borrowed"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    借りている本を返す
                  </RouterLink>
                  <RouterLink
                    to="/library/new"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    新しく本を寄贈する
                  </RouterLink>
                </div>
                <div class="py-1" role="none">
                  <RouterLink
                    to="/drafts/new"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    投稿を書く
                    <p class="text-xs text-gray-400">BOOK を SHARE しましょう</p>
                  </RouterLink>
                  <RouterLink
                    to="/drafts"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    投稿一覧
                    <p class="text-xs text-gray-400">下書きの仕上げ、過去の投稿の編集</p>
                  </RouterLink>
                </div>
                <div class="py-1" role="none">
                  <RouterLink
                    to="/"
                    class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                    exact
                    active-class="text-blue-600 border-l-gray-200"
                  >
                    設定
                  </RouterLink>
                </div>
                <div class="py-1" role="none">
                  <a
                    class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300 hover:text-blue-600"
                    @click="logout"
                  >
                    ログアウト
                  </a>
                </div>
              </div>
            </transition>
          </div>
          <!-- 投稿を書く -->
          <RouterLink
            to="/drafts/new"
            class="flex rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          >
            <Icon icon="line-md:edit-twotone" class="mr-2 -ml-1 h-5 w-5"> </Icon>
            投稿を書く
          </RouterLink>
        </nav>
      </div>
    </header>
    <!-- /Header -->

    <div class="h-full flex-grow">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ClickOutside from "vue-click-outside";
import { trpc } from "~/libs/trpc";

export default Vue.extend({
  directives: {
    ClickOutside,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    logout() {
      trpc.mutation("auth.delete");
      this.$router.replace("/login");
    },
  },
});
</script>

<style scoped></style>
