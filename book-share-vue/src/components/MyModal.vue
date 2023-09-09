<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';

defineProps<{
  component: unknown;
  componentProps: unknown;
  componentEvents: unknown;
}>();

onMounted(() => {
  open.value = true;
});

const emit = defineEmits<{
  success: [data: unknown];
  close: [];
}>();

function close() {
  open.value = false;
  setTimeout(() => emit('close'), 200);
}

function success(data: unknown) {
  open.value = false;
  setTimeout(() => emit('success', data), 200);
}

const open = ref(false);
</script>

<template>
  <div class="relative z-10" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <Transition
      enter-from-class="transform opacity-0"
      enter-active-class="transition ease-out duration-200"
      enter-to-class="transform opacity-100"
      leave-from-class="transform opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-to-class="transform opacity-0"
    >
      <div v-show="open" class="fixed inset-0 bg-gray-400/50"></div>
    </Transition>

    <!-- Modal -->
    <div class="fixed inset-0 z-10">
      <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
        <!-- Dialog -->
        <Transition
          enter-from-class="transform opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-active-class="transition ease-out duration-200"
          enter-to-class="transform opacity-100 translate-y-0 sm:scale-100"
          leave-from-class="transform opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-to-class="transform opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <OnClickOutside v-show="open" as="div" class="relative" @trigger="close">
            <component
              :is="component"
              class="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-gray-50 p-4 shadow-xl"
              v-bind="componentProps"
              v-on="componentEvents"
              @close="close"
              @success="success"
            />
            <MyButton
              type="button"
              classset="icon"
              colorset="white"
              class="absolute right-2 top-2"
              @click="close"
            >
              <Icon class="h-4 w-4" icon="bi:x" />
            </MyButton>
          </OnClickOutside>
        </Transition>
      </div>
    </div>
  </div>
</template>
