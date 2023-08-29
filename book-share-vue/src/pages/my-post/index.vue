<script setup lang="ts">
import SearchMyPost from '~/pages/my-post/components/SearchMyPost.vue';
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="uil:setting"
      :items="[
        {
          label: '投稿一覧',
          to: '/my-post',
        },
      ]"
    >
    </MyBreadcrumb>

    <SearchMyPost class="container mx-auto my-4"></SearchMyPost>

    <!-- TODO -->
    <!--
    <template v-else>
      <div class="mb-4 border-t-2 border-blue-300 bg-blue-50 p-4 dark:bg-blue-300" role="alert">
        <div class="flex items-center">
          <Icon icon="akar-icons:info-fill" class="mr-2 h-5 w-5 text-blue-900"></Icon>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-blue-900">まだ投稿はありません！</h3>
        </div>
        <div class="mt-2 mb-4 text-sm text-blue-900">
          本を読んだら投稿を書いて、 BOOK を SHARE しましょう
        </div>
        <div class="flex">
          <RouterLink
            tag="button"
            class="rounded-lg border border-blue-900 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-blue-800 dark:text-blue-800 dark:hover:text-white"
            to="/my-post/add"
          >
            さっそく投稿を書く
          </RouterLink>
        </div>
      </div>
    </template> -->
  </div>
</template>
