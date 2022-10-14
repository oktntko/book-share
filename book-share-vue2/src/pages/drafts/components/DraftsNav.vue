<template>
  <nav class="mb-4 flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center text-gray-500">
        <RouterLink
          to="/drafts"
          class="inline-flex items-center text-sm hover:text-blue-600 dark:text-gray-400"
          exact
          active-class="font-bold text-gray-700"
        >
          <Icon icon="game-icons:files" class="h-5 w-5"></Icon>
          投稿一覧
        </RouterLink>
      </li>
      <li class="inline-flex items-center">
        <RouterLink
          to="/drafts/new"
          class="inline-flex items-center text-sm hover:text-blue-600 dark:text-gray-400"
          exact
          active-class="font-bold text-gray-700"
        >
          <Icon icon="fluent:drafts-16-regular" class="h-5 w-5"></Icon>
          投稿を書く
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>
