<script setup lang="ts">
// TODO: FunctionalComponent でその場モーダルも作れるようにする
withDefaults(
  defineProps<{
    component: unknown;
    componentProps: object;
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
  if (refDialog.value) {
    const dialog = refDialog.value;

    dialog.addEventListener(
      'transitionend',
      () => {
        dialog.close();
        emit('close', returnValue);
      },
      { once: true },
    );

    open.value = false;
  } else {
    emit('close', returnValue);
  }
}
</script>

<template>
  <dialog ref="refDialog" :class="['rounded-lg shadow-xl', { open }, dialogClass]">
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
</template>

<style scoped lang="postcss">
dialog {
  @apply translate-y-4 transform opacity-0 transition duration-200 ease-out sm:translate-y-0 sm:scale-95;
}

dialog.open {
  @apply translate-y-0 opacity-100 sm:scale-100;
}

dialog::backdrop,
dialog + .backdrop {
  @apply bg-gray-400/50 opacity-0 transition duration-150 ease-out;
}

dialog.open::backdrop,
dialog.open + .backdrop {
  @apply opacity-100;
}
</style>
