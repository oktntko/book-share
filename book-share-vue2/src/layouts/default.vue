<template>
  <div class="min-h-screen bg-gray-50 text-gray-600 antialiased dark:bg-gray-700 dark:text-white">
    <!-- Header -->
    <header class="body-font">
      <div class="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
        <nav class="flex flex-wrap items-center gap-5 text-base md:ml-auto lg:w-2/5">
          <RouterLink to="/" class="hover:text-blue-600">投稿を読む</RouterLink>
          <RouterLink to="/" class="hover:text-blue-600">本を借りる</RouterLink>
          <RouterLink to="/" class="hover:text-blue-600">本棚に入れる</RouterLink>
          <RouterLink to="/" class="hover:text-blue-600">ニュース</RouterLink>
        </nav>
        <RouterLink
          to="/"
          class="title-font order-first mb-4 flex items-center font-medium text-gray-900 md:mb-0 lg:order-none lg:w-1/5 lg:items-center lg:justify-center"
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
          <button
            class="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
          >
            <span class="font-medium text-gray-600 dark:text-gray-300">JL</span>
          </button>
          <!-- 投稿を書く -->
          <RouterLink
            to="/drafts/new"
            tag="button"
            class="flex rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          >
            <Icon icon="line-md:edit-twotone" class="mr-2 -ml-1 h-5 w-5"> </Icon>
            投稿を書く
          </RouterLink>
        </nav>
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
