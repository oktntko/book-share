<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onMounted, ref, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    colorset?: "info" | "success" | "warning" | "danger";
    message?: string;
    duration?: number;
  }>(),
  {
    colorset: "info",
    message: "",
    duration: 2000 /*ms*/,
  },
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const open = ref(false);

const type = {
  success: { color: "green", icon: "bx:check" },
  warning: { color: "yellow", icon: "bx:info-circle" },
  danger: { color: "red", icon: "bx:error" },
  info: { color: "blue", icon: "bx:info-circle" },
};

const color = computed(() => {
  return type[props.colorset].color;
});
const icon = computed(() => {
  return type[props.colorset].icon;
});

onMounted(() => {
  open.value = true;

  setTimeout(close, props.duration);
});

function close() {
  open.value = false;
  setTimeout(() => emit("close"), 200);
}
</script>

<template>
  <Transition
    enter-from-class="transform opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-active-class="transition ease-out duration-200"
    enter-to-class="transform opacity-100 translate-y-0 sm:scale-100"
    leave-from-class="transform opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-to-class="transform opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="open"
      :class="`mt-4 flex w-full max-w-xs items-center rounded-lg p-4 text-gray-500 shadow-md dark:bg-gray-800 dark:text-gray-400
      ${
        color === 'green'
          ? 'bg-green-100 dark:bg-green-800'
          : color === 'yellow'
          ? 'bg-yellow-100 dark:bg-yellow-800'
          : color === 'red'
          ? 'bg-red-100 dark:bg-red-800'
          : 'bg-blue-100 dark:bg-blue-800'
      }`"
    >
      <div
        :class="`inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-lg
        ${
          color === 'green'
            ? ' text-green-500 dark:text-green-200'
            : color === 'yellow'
            ? ' text-yellow-500 dark:text-yellow-200'
            : color === 'red'
            ? ' text-red-500 dark:text-red-200'
            : ' text-blue-500 dark:text-blue-200'
        }`"
      >
        <Icon class="h-5 w-5" :icon="icon" />
        <span class="sr-only">Icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">{{ message }}</div>
      <button
        type="button"
        class="-mx-1.5 -my-1.5 ml-4 inline-flex h-8 w-8 rounded-lg bg-transparent p-1.5 text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
        data-dismiss-target="#toast-default"
        aria-label="Close"
        @click="close"
      >
        <Icon class="h-5 w-5" icon="bi:x" />
      </button>
    </div>
  </Transition>
</template>
