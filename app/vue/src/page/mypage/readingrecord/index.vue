<script setup lang="ts">
useTitle('本棚 | BookShare');

import SearchMyReadingrecord from '~/page/mypage/readingrecord/component/SearchMyReadingrecord.vue';
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
            label: '本棚',
            to: '/mypage/readingrecord',
          },
        ]"
      >
      </MyBreadcrumb>

      <SearchMyReadingrecord></SearchMyReadingrecord>
    </div>
  </div>
</template>
