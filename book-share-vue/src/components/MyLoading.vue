<script setup lang="ts">
const emit = defineEmits<{
  close: [returnValue?: string | undefined];
}>();

const refDialog = ref<HTMLDialogElement>();
const open = ref(false);

onMounted(() => {
  if (refDialog.value) {
    const dialog = refDialog.value;
    dialog.showModal();

    // ESCキーでキャンセルするとき閉じない
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
    });

    open.value = true;
  }
});

function closeDelay(returnValue?: string | undefined) {
  open.value = false;
  setTimeout(() => {
    emit('close', returnValue);
    refDialog.value?.close();
  }, 200);
}

defineExpose({
  close: closeDelay,
});
</script>

<template>
  <!-- Overlay -->
  <Transition
    enter-from-class="transform opacity-0"
    enter-active-class="transition ease-out duration-200"
    enter-to-class="transform opacity-100"
    leave-from-class="transform opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-to-class="transform opacity-0"
  >
    <dialog v-show="open" ref="refDialog" class="flex flex-col items-center bg-transparent">
      <Icon
        icon="eos-icons:bubble-loading"
        class="h-16 w-16 text-gray-600 text-opacity-60 dark:text-gray-800 dark:text-opacity-60"
      />
      <span class="sr-only">Loading...</span>
      <input autofocus class="border-none bg-transparent caret-transparent outline-none" />
    </dialog>
  </Transition>
</template>

<style scoped lang="postcss">
dialog::backdrop,
dialog + .backdrop {
  @apply fixed inset-0 bg-gray-400/50 backdrop-blur-[1px];
}

/* dialog スタイル https://web.dev/articles/building/a-dialog-component */

dialog[open]::backdrop {
  @apply animate-[animate-backdrop-enter_200ms_ease-out];
}

/* TODO: 効いてない */
dialog:not([open])::backdrop {
  @apply animate-[animate-backdrop-enter_200ms_ease-out];
  animation-direction: reverse;
}

@keyframes animate-backdrop-enter {
  from {
    @apply transform opacity-0;
  }
  to {
    @apply transform opacity-100;
  }
}
</style>
