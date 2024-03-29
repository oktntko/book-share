<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';
import { trpc } from '~/middleware/trpc';
import { useAuthStore } from '~/stores/AuthStore';

const showMenu = ref(false);
const keyword = ref('');

const { auth } = storeToRefs(useAuthStore());
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gray-50 text-gray-800 antialiased dark:bg-gray-700 dark:text-white"
  >
    <!-- Header -->
    <header class="border-b-2 bg-gray-100">
      <div class="container mx-auto flex flex-col flex-wrap items-center px-4 py-4 md:flex-row">
        <nav class="flex flex-wrap items-center gap-5 text-base md:ml-auto lg:w-2/5">
          <RouterLink
            to="/"
            class="hover:text-blue-600"
            active-class="text-blue-600 border-b-gray-200"
          >
            投稿を読む
          </RouterLink>
          <!-- 検索 -->
          <form @submit.prevent="$router.push({ path: '/', query: { keyword } })">
            <label
              for="keyword"
              class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Search
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
              </div>
              <input
                id="keyword"
                v-model="keyword"
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="投稿を探す"
                required
              />
            </div>
          </form>
          <RouterLink
            to="/book"
            class="hover:text-blue-600"
            active-class="text-blue-600 border-b-gray-200 "
          >
            本を探す
            <!-- 投稿を書く・投稿を探す・記録をつける -->
          </RouterLink>
        </nav>
        <RouterLink
          to="/"
          class="order-first mb-4 flex items-center font-medium text-gray-900 md:mb-0 lg:order-none lg:w-1/5 lg:items-center lg:justify-center"
        >
          <Icon icon="noto-v1:books" class="ml-[-16px] h-10 w-10 rounded-full p-2 text-white">
          </Icon>
          <span class="text-xl">Book Share</span>
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-5 text-base lg:ml-0 lg:w-2/5 lg:justify-end">
          <!-- ログイン中 -->
          <template v-if="auth?.auth">
            <!-- ベルマーク -->
            <button type="button">
              <Icon icon="mdi:bell" class="h-5 w-5"> </Icon>
            </button>
            <div class="relative inline-block text-left">
              <OnClickOutside
                class="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
                @trigger="() => (showMenu = false)"
              >
                <MyButton
                  type="button"
                  classset="icon"
                  colorset="white"
                  @click="showMenu = !showMenu"
                >
                  <span class="font-medium text-gray-600 dark:text-gray-300">⚙️</span>
                </MyButton>
              </OnClickOutside>

              <Transition
                enter-from-class="transform opacity-0 scale-95"
                enter-active-class="transition ease-out duration-100"
                enter-to-class="transform opacity-100 scale-100"
                leave-from-class="transform opacity-100 scale-100"
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
                      to="/mypage/readingrecord"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact
                      active-class="text-blue-600 border-l-gray-200"
                    >
                      マイ本棚
                      <p class="text-xs text-gray-400">読書の記録の確認はここから</p>
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
                      to="/mypage/post/add"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact
                      active-class="text-blue-600 border-l-gray-200"
                    >
                      投稿を書く
                      <p class="text-xs text-gray-400">BOOK を SHARE しましょう</p>
                    </RouterLink>
                    <RouterLink
                      to="/mypage/post"
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
                      to="/mypage/profile"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact
                      active-class="text-blue-600 border-l-gray-200"
                    >
                      プロフィール
                    </RouterLink>
                  </div>
                  <div class="py-1" role="none">
                    <a
                      class="block cursor-pointer px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300 hover:text-blue-600"
                      @click="
                        async () => {
                          try {
                            await trpc.auth.delete.mutate();
                          } finally {
                            $router.replace('/login');
                          }
                        }
                      "
                    >
                      ログアウト
                    </a>
                  </div>
                </div>
              </Transition>
            </div>
            <RouterLink
              to="/mypage/post/add"
              class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-800 hover:text-white focus:outline-none focus:ring"
            >
              <Icon icon="line-md:edit-twotone" class="-ml-1 mr-2 h-4 w-4"> </Icon>
              投稿を書く
            </RouterLink>
          </template>

          <!-- ゲスト -->
          <template v-else-if="auth?.auth === false">
            <RouterLink
              to="/login"
              class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-200 focus:outline-none focus:ring"
            >
              <Icon icon="material-symbols:login" class="-ml-1 mr-2 h-4 w-4"> </Icon>
              ログイン
            </RouterLink>
            <RouterLink
              to="/signup"
              class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-800 hover:text-white focus:outline-none focus:ring"
            >
              <Icon icon="el:ok-sign" class="-ml-1 mr-2 h-4 w-4"> </Icon>
              新規登録
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>
    <!-- /Header -->

    <main class="grow px-4">
      <RouterView />
    </main>
  </div>
</template>
