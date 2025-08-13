<script setup lang="ts">
import SearchMyPost from '~/page/mypage/post/component/SearchMyPost.vue';
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
            label: '投稿一覧',
            to: '/mypage/post',
          },
        ]"
      >
      </MyBreadcrumb>

      <SearchMyPost></SearchMyPost>
    </div>
  </div>
</template>
