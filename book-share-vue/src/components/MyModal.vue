<script setup lang="ts">
// TODO: FunctionalComponent でその場モーダルも作れるようにする
withDefaults(
  defineProps<{
    component: unknown;
    componentProps: unknown;
    componentEvents: unknown;
    componentClass?: string;
    dialogClass?: string;
  }>(),
  {
    componentClass: '',
    dialogClass: '',
  },
);

const emit = defineEmits<{
  close: [data?: unknown];
}>();

const refDialog = ref<HTMLDialogElement>();
const open = ref(false);

onMounted(() => {
  if (refDialog.value) {
    const dialog = refDialog.value;
    dialog.showModal();

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDelay();
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        closeDelay();
      }
    });

    open.value = true;
  }
});

function closeDelay(returnValue?: unknown | undefined) {
  open.value = false;
  setTimeout(() => {
    emit('close', returnValue);
    refDialog.value?.close();
  }, 200);
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
    <dialog v-show="open" ref="refDialog" class="rounded-lg shadow-xl" :class="dialogClass">
      <component
        :is="component"
        :class="componentClass"
        v-bind="componentProps"
        v-on="componentEvents"
        @close="(data: unknown) => closeDelay(data)"
      />
      <MyButton
        type="button"
        classset="icon"
        colorset="white"
        class="absolute right-2 top-2"
        @click="closeDelay()"
      >
        <Icon class="h-4 w-4" icon="bi:x" />
      </MyButton>
    </dialog>
  </Transition>
</template>

<style scoped lang="postcss">
dialog::backdrop,
dialog + .backdrop {
  @apply fixed inset-0 bg-gray-400/50;
}

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
