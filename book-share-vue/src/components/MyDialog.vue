<script setup lang="ts">
import type MyButton from '~/components/MyButton.vue';

const CONFIRMED_VALUE = 'confirmed';

withDefaults(
  defineProps<{
    message: string;
    colorset?: 'blue' | 'green' | 'yellow' | 'red';
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    autofocus?: 'confirm' | 'cancel';
    title?: string;
  }>(),
  {
    colorset: 'blue',
    icon: '',
    confirmText: 'OK',
    cancelText: 'やめる',
    autofocus: 'cancel',
    title: '',
  },
);

const emit = defineEmits<{
  close: [ok: boolean];
}>();

const refDialog = ref<HTMLDialogElement>();
const open = ref(false);

onMounted(() => {
  if (refDialog.value) {
    const dialog = refDialog.value;
    dialog.showModal();

    // ESCキーでキャンセルするとき閉じる
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDelay();
    });

    // ダイアログの外側がクリックされたとき閉じる
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        closeDelay();
      }
    });

    open.value = true;
  }
});

/**
 * <dialog> を閉じる方法
 * 1. Escキーによる
 *    - Escキーを押すとダイアログが閉じる
 *    - ＜イベント＞ HTMLDialogElement cancel => close(returnValue は空文字(string))
 * 2. <form method="dialog">
 *    - submit ボタンがクリックされたときにダイアログが閉じる
 *    - HTMLDialogElement.returnValue プロパティに submit ボタンの value が設定される
 *      - value が設定されていないボタンをクリックしたとき、 returnValue は空文字(string)
 *    - ＜イベント＞ HTMLDialogElement submit => close(returnValue が取得できる)
 *    ↑ HTMLだけで完結するので、この方法が一番簡単だけど、 <Transition> との兼ね合いで `.close()` メソッド を使っている
 * 3. `.close()` メソッド
 *    - `.close()` メソッドを実行するとダイアログが閉じる
 *    - `.close()`の引数に returnValue を渡すことができる。 引数を渡さなかったとき(undefined)でも、 returnValueは空文字
 *    - ＜イベント＞ HTMLDialogElement close(returnValue は空文字(string))
 */

function closeDelay(returnValue?: typeof CONFIRMED_VALUE | undefined) {
  if (refDialog.value) {
    const dialog = refDialog.value;

    dialog.addEventListener(
      'transitionend',
      () => {
        dialog.close();
        emit('close', returnValue === CONFIRMED_VALUE);
      },
      { once: true },
    );

    open.value = false;
  } else {
    emit('close', returnValue === CONFIRMED_VALUE);
  }
}
</script>

<template>
  <dialog ref="refDialog" :class="['max-w-xl rounded-lg shadow-xl', { open }]">
    <form method="dialog">
      <header
        v-if="title"
        class="flex items-start justify-between border-b border-gray-200 px-4 py-3"
      >
        <h3>{{ title }}</h3>
      </header>

      <main class="flex items-start gap-4 px-4 py-6">
        <div
          v-if="icon"
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
          :class="{
            'bg-green-100' /*  */: colorset === 'green',
            'bg-yellow-100' /* */: colorset === 'yellow',
            'bg-red-100' /*    */: colorset === 'red',
            'bg-blue-100' /*   */: colorset === 'blue',
          }"
        >
          <Icon
            class="h-6 w-6"
            :class="{
              'text-green-600' /*  */: colorset === 'green',
              'text-yellow-600' /* */: colorset === 'yellow',
              'text-red-600' /*    */: colorset === 'red',
              'text-blue-600' /*   */: colorset === 'blue',
            }"
            :icon="icon"
          />
        </div>

        <div>
          <p class="whitespace-pre-wrap text-sm text-gray-500">
            {{ message }}
          </p>
        </div>
      </main>

      <footer class="flex justify-end gap-4 bg-gray-50 px-4 py-3">
        <MyButton
          v-if="cancelText"
          type="button"
          colorset="white"
          classset="text"
          :autofocus="autofocus === 'cancel'"
          @click="closeDelay()"
        >
          {{ cancelText }}
        </MyButton>
        <MyButton
          v-if="confirmText"
          type="button"
          :colorset="colorset"
          classset="text"
          :autofocus="autofocus === 'confirm'"
          @click="closeDelay(CONFIRMED_VALUE)"
        >
          {{ confirmText }}
        </MyButton>
      </footer>
    </form>
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
