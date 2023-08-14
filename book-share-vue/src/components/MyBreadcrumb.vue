<script setup lang="ts">
type Item = {
  to: string;
  label: string;
};
defineProps<{ items: Item[]; icon: string }>();
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center gap-2">
      <li v-for="(item, i) of items" :key="item.to">
        <div class="flex items-center gap-2">
          <Icon :icon="i === 0 ? icon : 'icon-park:right'" class="h-4 w-4 text-gray-400"> </Icon>

          <RouterLink
            :to="item.to"
            class="text-xs font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            exact-active-class="text-blue-600"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </li>
    </ol>
  </nav>
</template>
