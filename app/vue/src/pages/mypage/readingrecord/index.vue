<script setup lang="ts">
import SearchMyReadingrecord from '~/pages/mypage/readingrecord/components/SearchMyReadingrecord.vue';
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="uil:setting"
      :items="[
        {
          label: '読んだ本',
          to: '/mypage/readingrecord',
        },
      ]"
    >
    </MyBreadcrumb>

    <SearchMyReadingrecord class="container mx-auto my-4"></SearchMyReadingrecord>
  </div>
</template>
