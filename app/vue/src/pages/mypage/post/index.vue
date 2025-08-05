<script setup lang="ts">
import SearchMyPost from '~/pages/mypage/post/components/SearchMyPost.vue';
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="uil:setting"
      :items="[
        {
          label: '投稿一覧',
          to: '/mypage/post',
        },
      ]"
    >
    </MyBreadcrumb>

    <SearchMyPost class="container mx-auto my-4"></SearchMyPost>
  </div>
</template>
