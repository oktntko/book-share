<script setup lang="ts">
import SearchUser from '~/pages/system/user/components/SearchUser.vue';
</script>

<template>
  <div class="mb-8">
    <MyBreadcrumb
      class="container mx-auto my-4"
      icon="fa-solid:users"
      :items="[
        {
          label: 'ユーザ管理',
          to: '/system/user',
        },
      ]"
    >
    </MyBreadcrumb>

    <SearchUser class="container mx-auto my-4"></SearchUser>
  </div>
</template>
