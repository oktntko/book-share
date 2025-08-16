<script setup lang="ts">
useTitle('プロフィール | BookShare');
</script>

<template>
  <div class="px-4 py-4 xl:container xl:mx-auto">
    <div class="flex flex-col gap-4">
      <MyBreadcrumb
        icon="icon-[uil--setting]"
        :items="[
          {
            label: 'マイページ',
            to: '/mypage/',
          },
          {
            label: 'プロフィール',
            to: '/mypage/profile/',
          },
        ]"
      >
      </MyBreadcrumb>

      <div class="flex flex-col gap-8 sm:flex-row">
        <aside class="w-full shrink-0 sm:w-40 xl:w-80">
          <ul>
            <li>
              <RouterLink
                :to="{ name: '/mypage/profile/' }"
                class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
                exact-active-class="text-blue-600 border-l-blue-400!"
              >
                <span
                  class="icon-[material-symbols--public] h-5 w-5 text-gray-500 group-hover:text-gray-900"
                >
                </span>
                <span class="ml-2">公開情報</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: '/mypage/profile/change-password' }"
                class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
                exact-active-class="text-blue-600 border-l-blue-400!"
              >
                <span
                  class="icon-[mdi--password-outline] h-5 w-5 text-gray-500 group-hover:text-gray-900"
                >
                </span>
                <span class="ml-2">パスワード変更</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: '/mypage/profile/security' }"
                class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
                exact-active-class="text-blue-600 border-l-blue-400!"
              >
                <span
                  class="icon-[wpf--security-checked] h-5 w-5 text-gray-500 group-hover:text-gray-900"
                >
                </span>
                <span class="ml-2">セキュリティ</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: '/mypage/profile/account' }"
                class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
                exact-active-class="text-blue-600 border-l-blue-400!"
              >
                <span
                  class="icon-[codicon--account] h-5 w-5 text-gray-500 group-hover:text-gray-900"
                >
                </span>
                <span class="ml-2">アカウント</span>
              </RouterLink>
            </li>
          </ul>
        </aside>

        <RouterView v-slot="{ Component }" class="grow">
          <template v-if="Component">
            <Transition
              mode="out-in"
              enter-from-class="transform opacity-0"
              enter-active-class="transition ease-out duration-200"
              enter-to-class="transform opacity-100"
            >
              <KeepAlive>
                <Suspense>
                  <!-- main content -->
                  <component :is="Component"></component>

                  <!-- loading state -->
                  <template #fallback>
                    <MyLoading class="flex grow flex-col gap-8 lg:max-w-3xl xl:max-w-4xl" />
                  </template>
                </Suspense>
              </KeepAlive>
            </Transition>
          </template>
        </RouterView>
      </div>
    </div>
  </div>
</template>
