<script setup lang="ts"></script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="uil:setting"
      :items="[
        {
          label: 'プロフィール編集',
          to: '/mypage/profile',
        },
      ]"
    >
    </MyBreadcrumb>

    <div class="container mx-auto my-4 flex gap-8">
      <aside class="w-80 shrink-0">
        <ul>
          <li>
            <RouterLink
              to="/mypage/profile"
              class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
              exact-active-class="text-blue-600 border-l-blue-400"
            >
              <Icon
                icon="material-symbols:public"
                class="h-5 w-5 text-gray-500 group-hover:text-gray-900"
              >
              </Icon>
              <span class="ml-2">公開情報</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/mypage/profile/change-password"
              class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
              exact-active-class="text-blue-600 border-l-blue-400"
            >
              <Icon
                icon="mdi:password-outline"
                class="h-5 w-5 text-gray-500 group-hover:text-gray-900"
              >
              </Icon>
              <span class="ml-2">パスワード変更</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/mypage/profile/security"
              class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
              exact-active-class="text-blue-600 border-l-blue-400"
            >
              <Icon
                icon="wpf:security-checked"
                class="h-5 w-5 text-gray-500 group-hover:text-gray-900"
              >
              </Icon>
              <span class="ml-2">セキュリティ</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/mypage/profile/account"
              class="group flex items-center rounded-lg rounded-l-none border-l-4 border-l-transparent p-2 hover:bg-gray-100"
              exact-active-class="text-blue-600 border-l-blue-400"
            >
              <Icon icon="codicon:account" class="h-5 w-5 text-gray-500 group-hover:text-gray-900">
              </Icon>
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
                  <MyPulseLoading
                    class="flex grow flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl"
                  />
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </div>
  </div>
</template>
