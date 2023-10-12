<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';
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

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDelay();
    });

    dialog.addEventListener('close', () => {
      emit('close', dialog.returnValue === CONFIRMED_VALUE);
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

function closeDelay(returnValue?: string | undefined) {
  open.value = false;
  setTimeout(() => refDialog.value?.close(returnValue), 200);
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
    <dialog v-show="open" ref="refDialog" class="max-w-xl rounded-lg shadow-xl">
      <OnClickOutside as="form" method="dialog" @trigger="closeDelay">
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
      </OnClickOutside>
    </dialog>
  </Transition>
</template>

<style scoped>
dialog::backdrop,
dialog + .backdrop {
  @apply fixed inset-0 bg-gray-400/50;
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
