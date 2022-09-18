<template>
  <div class="min-h-screen bg-gray-50 text-gray-600 antialiased dark:bg-gray-700 dark:text-white">
    <!-- Header -->
    <header class="body-font">
      <div class="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
        <nav class="flex flex-wrap items-center text-base md:ml-auto lg:w-2/5">
          <RouterLink to="/" class="mr-5 hover:text-blue-600">投稿を読む</RouterLink>
          <RouterLink to="/" class="mr-5 hover:text-blue-600">本を借りる</RouterLink>
          <RouterLink to="/" class="mr-5 hover:text-blue-600">本棚に入れる</RouterLink>
          <RouterLink to="/" class="mr-5 hover:text-blue-600">ニュース</RouterLink>
        </nav>
        <RouterLink
          to="/"
          class="title-font order-first mb-4 flex items-center font-medium text-gray-900 md:mb-0 lg:order-none lg:w-1/5 lg:items-center lg:justify-center"
        >
          <Icon icon="noto-v1:books" class="h-10 w-10 rounded-full p-2 text-white"> </Icon>
          <span class="ml-3 text-xl">Book Share</span>
        </RouterLink>
        <div class="ml-5 inline-flex lg:ml-0 lg:w-2/5 lg:justify-end">
          本棚検索 or 投稿検索 <br />
          通知マーク <br />
          プロフィールアイコン <br />
          投稿を書くボタン <br />
        </div>
      </div>
    </header>
    <!-- /Header -->

    <div class="min-h-full">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts"></script>

<style scoped></style>
