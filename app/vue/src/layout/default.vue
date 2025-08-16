<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';
import { trpc } from '~/lib/trpc';
import { useAuthStore } from '~/store/AuthStore';

const $router = useRouter();

const showMenu = ref(false);
const keyword = ref('');

const { profile } = storeToRefs(useAuthStore());
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gray-50 text-gray-800 antialiased dark:bg-gray-700 dark:text-white"
  >
    <!-- Header -->
    <header class="h-16 border-b border-gray-200 bg-gray-100">
      <div class="flex gap-4 px-4 py-4 md:grid md:grid-cols-3 xl:container xl:mx-auto">
        <nav class="inline-flex grow items-center justify-end gap-2 text-base md:justify-start">
          <RouterLink
            :to="{ name: '/' }"
            class="hover:text-blue-600"
            exact-active-class="text-blue-600 border-b-gray-200"
          >
            投稿を読む
          </RouterLink>
          <!-- 検索 -->
          <form
            class="hidden xl:inline-block"
            @submit.prevent="$router.push({ path: '/', query: { keyword } })"
          >
            <label for="keyword" class="sr-only"> Search </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="icon-[flat-color-icons--search] h-5 w-5"> </span>
              </div>
              <input
                id="keyword"
                v-model="keyword"
                type="search"
                class="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="投稿を探す"
                required
              />
            </div>
          </form>
          <RouterLink
            :to="{ name: '/book/' }"
            class="hover:text-blue-600"
            exact-active-class="text-blue-600 border-b-gray-200 "
          >
            本を探す
            <!-- 投稿を書く・投稿を探す・記録をつける -->
          </RouterLink>
        </nav>
        <RouterLink
          :to="{ name: '/' }"
          class="order-first inline-flex items-center justify-center font-medium text-gray-900 md:order-none"
        >
          <span class="icon-[noto-v1--books] h-10 w-10 rounded-full p-2 text-white"> </span>
          <span class="ml-2 text-xl">Book Share</span>
        </RouterLink>
        <nav class="inline-flex items-center justify-end gap-2 text-base">
          <!-- ログイン中 -->
          <template v-if="profile != null">
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
                  <img
                    v-if="profile.avatar_image"
                    :src="profile.avatar_image"
                    width="32"
                    height="32"
                    decoding="async"
                    class="h-8 w-8 rounded-full object-cover object-center"
                    alt="avatar"
                  />
                  <span
                    v-else
                    class="icon-[clarity--avatar-solid] h-8 w-8 rounded-full object-cover object-center text-gray-400"
                  ></span>
                </MyButton>
              </OnClickOutside>

              <Transition
                enter-from-class="transform opacity-0 scale-95"
                enter-exact-active-class="transition ease-out duration-100"
                enter-to-class="transform opacity-100 scale-100"
                leave-from-class="transform opacity-100 scale-100"
                leave-exact-active-class="transition ease-in duration-75"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="showMenu"
                  class="ring-opacity-5 absolute right-0 z-50 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-black focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  tabindex="-1"
                >
                  <div class="py-1" role="none">
                    <RouterLink
                      :to="{ name: '/mypage/readingrecord/' }"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact-active-class="text-blue-600 border-l-gray-200"
                    >
                      本棚
                      <p class="text-xs text-gray-400">読書の記録の確認はここから</p>
                    </RouterLink>
                    <RouterLink
                      :to="{ name: '/' }"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact-active-class="text-blue-600 border-l-gray-200"
                    >
                      ストックした投稿
                      <p class="text-xs text-gray-400">参考になった投稿を確認する</p>
                    </RouterLink>
                  </div>
                  <div class="py-1" role="none">
                    <RouterLink
                      :to="{ name: '/mypage/post/add' }"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact-active-class="text-blue-600 border-l-gray-200"
                    >
                      投稿を書く
                      <p class="text-xs text-gray-400">BOOK を SHARE しましょう</p>
                    </RouterLink>
                    <RouterLink
                      :to="{ name: '/mypage/post/' }"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
                      exact-active-class="text-blue-600 border-l-gray-200"
                    >
                      投稿一覧
                      <p class="text-xs text-gray-400">下書きの仕上げ、過去の投稿の編集</p>
                    </RouterLink>
                  </div>
                  <div class="py-1" role="none">
                    <RouterLink
                      :to="{ name: '/mypage/profile/' }"
                      class="block border-l-4 border-l-transparent px-4 py-2 text-sm transition-colors hover:bg-gray-300 hover:text-blue-600"
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
              :to="{ name: '/mypage/post/add' }"
              class="hidden min-w-[120px] items-center justify-center rounded-md border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-800 hover:text-white focus:ring focus:outline-none md:inline-flex"
            >
              <span class="icon-[line-md--edit-twotone] mr-2 -ml-1 h-4 w-4"> </span>
              投稿を書く
            </RouterLink>
          </template>

          <!-- ゲスト -->
          <template v-else>
            <RouterLink
              to="/login"
              class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-200 focus:ring focus:outline-none"
            >
              <span class="icon-[material-symbols--login] mr-2 -ml-1 h-4 w-4"> </span>
              ログイン
            </RouterLink>
            <RouterLink
              to="/signup"
              class="inline-flex min-w-[120px] items-center justify-center rounded-md border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-800 hover:text-white focus:ring focus:outline-none"
            >
              新規登録
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>
    <!-- /Header -->

    <div class="grow">
      <RouterView />
    </div>
  </div>
</template>
