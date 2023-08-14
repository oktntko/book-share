<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';
import type MyButton from '~/components/MyButton.vue';

const props = withDefaults(
  defineProps<{
    colorset?: 'blue' | 'green' | 'yellow' | 'red';
    icon?: string;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    closeable?: {
      button: boolean;
      escape: boolean;
      outside: boolean;
    };
    focusOn?: 'confirm' | 'cancel';
  }>(),
  {
    colorset: 'blue',
    icon: '',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'やめる',
    closeable: () => ({
      button: true,
      escape: true,
      outside: true,
    }),
    focusOn: 'cancel',
  },
);

const open = ref(false);
const refConfirmButton = ref<InstanceType<typeof MyButton> | null>(null);
const refCancelButton = ref<InstanceType<typeof MyButton> | null>(null);

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();

onMounted(() => {
  open.value = true;

  document.addEventListener('keyup', handleEscapeKeyPress);
  document.getElementById('app')?.addEventListener('focusin', focusComponent);

  nextTick(focusComponent);
});
onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleEscapeKeyPress);
  document.getElementById('app')?.removeEventListener('focusin', focusComponent);
});

function handleCancelButtonClicked() {
  if (props.closeable.button) {
    cancel();
  }
}
function handleEscapeKeyPress(event: KeyboardEvent) {
  if (props.closeable.escape && event.key === 'Escape') {
    cancel();
  }
}
function handleOutsideClicked() {
  if (props.closeable.outside) {
    cancel();
  }
}

function focusComponent() {
  if (props.closeable.button && props.focusOn === 'cancel') {
    refCancelButton.value?.$el.focus();
  } else {
    refConfirmButton.value?.$el.focus();
  }
}

function cancel() {
  open.value = false;
  setTimeout(() => emit('cancel'), 200);
}
function confirm() {
  open.value = false;
  setTimeout(() => emit('confirm'), 200);
}
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
      <div v-show="open" class="fixed inset-0 bg-gray-400/50" />
    </Transition>

    <!-- Modal -->
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Dialog -->
        <Transition
          enter-from-class="transform opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-active-class="transition ease-out duration-200"
          enter-to-class="transform opacity-100 translate-y-0 sm:scale-100"
          leave-from-class="transform opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-to-class="transform opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <OnClickOutside
            v-show="open"
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"
            as="div"
            @trigger="handleOutsideClicked"
          >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  v-if="icon"
                  :class="`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10
                  ${
                    colorset === 'green'
                      ? 'bg-green-100'
                      : colorset === 'yellow'
                      ? 'bg-yellow-100'
                      : colorset === 'red'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`"
                >
                  <Icon
                    :class="`h-6 w-6
                    ${
                      colorset === 'green'
                        ? 'text-green-600'
                        : colorset === 'yellow'
                        ? 'text-yellow-600'
                        : colorset === 'red'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`"
                    :icon="icon"
                  />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 v-if="title" class="text-lg font-medium leading-6 text-gray-900">
                    {{ title }}
                  </h3>
                  <div v-if="message" class="mt-2">
                    <p class="whitespace-pre-wrap text-sm text-gray-500">
                      {{ message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-4 bg-gray-50 px-4 py-3 sm:px-6">
              <MyButton
                v-if="closeable.button"
                ref="refCancelButton"
                type="button"
                colorset="white"
                classset="text"
                @click="handleCancelButtonClicked"
              >
                {{ cancelText }}
              </MyButton>
              <MyButton
                ref="refConfirmButton"
                type="button"
                :colorset="colorset"
                classset="text"
                @click="confirm"
              >
                {{ confirmText }}
              </MyButton>
            </div>
          </OnClickOutside>
        </Transition>
      </div>
    </div>
  </div>
</template>
