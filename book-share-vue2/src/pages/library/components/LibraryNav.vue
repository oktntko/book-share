<template>
  <nav class="mb-4 flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center text-gray-500">
        <RouterLink
          to="/library"
          class="inline-flex items-center text-sm hover:text-blue-600 dark:text-gray-400"
          exact
          active-class="font-bold text-gray-700"
        >
          <Icon icon="game-icons:bookshelf" class="mr-1 h-5 w-5"></Icon>
          図書館の本
        </RouterLink>
      </li>
      <li class="inline-flex items-center">
        <RouterLink
          to="/library/borrowed"
          class="inline-flex items-center text-sm hover:text-blue-600 dark:text-gray-400"
          exact
          active-class="font-bold text-gray-700"
        >
          <Icon icon="icon-park:return" class="mr-1 h-5 w-5"></Icon>
          借りている本を返す
        </RouterLink>
      </li>
      <li class="inline-flex items-center">
        <RouterLink
          to="/library/new"
          class="inline-flex items-center text-sm hover:text-blue-600 dark:text-gray-400"
          exact
          active-class="font-bold text-gray-700"
        >
          <Icon icon="bx:donate-heart" class="mr-1 h-5 w-5"></Icon>
          新しく本を寄贈する
        </RouterLink>
      </li>
      <li class="inline-flex items-center">
        <RouterLink
          to="/library/donated"
          class="inline-flex items-center text-sm hover:text-blue-600 dark:text-gray-400"
          exact
          active-class="font-bold text-gray-700"
        >
          <Icon icon="bi:postcard-heart" class="mr-1 h-5 w-5"></Icon>
          寄贈した本
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>
