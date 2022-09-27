<template>
  <div class="relative z-10" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <transition
      enter-class="opacity-0"
      enter-active-class="ease-out duration-200"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      :leave-active-class="`ease-in duration-${dissmissDuration}`"
      leave-to-class="opacity-0"
    >
      <div
        v-show="open"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-[1px] transition-opacity"
      ></div>
    </transition>

    <!-- Modal -->
    <div class="fixed inset-0 z-10 overflow-y-auto" @click="handleOutsideClicked">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Dialog -->
        <transition
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-active-class="ease-out duration-200"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          :leave-active-class="`ease-in duration-${dissmissDuration}`"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-show="open"
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            @click.stop
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  v-if="icon"
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                  :class="
                    color === 'green'
                      ? 'bg-green-100'
                      : color === 'yellow'
                      ? 'bg-yellow-100'
                      : color === 'red'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  "
                >
                  <Icon
                    class="h-6 w-6"
                    :class="
                      color === 'green'
                        ? 'text-green-600'
                        : color === 'yellow'
                        ? 'text-yellow-600'
                        : color === 'red'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    "
                    :icon="icon"
                  />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    v-if="title"
                    id="modal-title"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    {{ title }}
                  </h3>
                  <div v-if="message" class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                ref="refConfirmButton"
                type="button"
                class="inline-flex min-w-[120px] justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:translate-y-0 sm:scale-95 sm:text-sm"
                :class="
                  color === 'green'
                    ? 'bg-green-600 hover:bg-green-700'
                    : color === 'yellow'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : color === 'red'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                "
                @click="confirm"
              >
                {{ confirmText }}
              </button>
              <button
                v-if="canCancel.button"
                ref="refCancelButton"
                type="button"
                class="mt-3 inline-flex min-w-[120px] justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="handleCancelButtonClicked"
              >
                {{ cancelText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

type DialogProps = Partial<{
  colorset: "info" | "success" | "warning" | "danger";
  icon: string;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  canCancel: {
    escape: boolean;
    button: boolean;
    outside: boolean;
  };
  focusOn: string;
}>;

const Dialog = Vue.extend({
  props: {
    colorset: {
      type: String,
      required: false,
      default: "info",
      validator: (value: unknown) =>
        typeof value === "string" && ["info", "success", "warning", "danger"].includes(value),
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    message: {
      type: String,
      required: false,
      default: "",
    },
    confirmText: {
      type: String,
      required: false,
      default: "OK",
    },
    cancelText: {
      type: String,
      required: false,
      default: "やめる",
    },
    canCancel: {
      type: Object as PropType<{
        escape: boolean;
        button: boolean;
        outside: boolean;
      }>,
      required: false,
      default: () => ({
        button: true,
        escape: true,
        outside: true,
      }),
    },
    focusOn: {
      type: String,
      required: false,
      default: "Cancel",
      validator: (value: unknown) => value === "Confirm" || value === "Cancel",
    },
  },
  data() {
    return {
      open: false,
      dissmissDuration: 200 /*ms*/,
    };
  },
  computed: {
    color(): string {
      if (this.colorset === "success") {
        return "green";
      } else if (this.colorset === "warning") {
        return "yellow";
      } else if (this.colorset === "danger") {
        return "red";
      } else {
        return "blue";
      }
    },
  },
  mounted() {
    this.open = true;

    document.addEventListener("keyup", this.handleEscapeKeyPress);

    this.$nextTick(() => {
      // $nextTick を入れないとフォーカスが移動しない
      if (this.focusOn === "Confirm" || !this.canCancel.button) {
        (this.$refs.refConfirmButton as HTMLButtonElement).focus();
      } else {
        (this.$refs.refCancelButton as HTMLButtonElement).focus();
      }
    });
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.handleEscapeKeyPress);
  },
  methods: {
    handleCancelButtonClicked() {
      if (this.canCancel.button) {
        this.cancel();
      }
    },
    handleEscapeKeyPress(event: KeyboardEvent) {
      if (this.canCancel.escape && event.key === "Escape") {
        this.cancel();
      }
    },
    handleOutsideClicked() {
      if (this.canCancel.outside) {
        this.cancel();
      }
    },

    cancel() {
      this.open = false;
      setTimeout(() => this.$emit("cancel"), this.dissmissDuration);
    },
    confirm() {
      this.open = false;
      setTimeout(() => this.$emit("confirm"), this.dissmissDuration);
    },
  },
});

export default Dialog;

export const $dialog = {
  open(propsData: DialogProps) {
    const instance = new Dialog({ propsData }).$mount();
    const parent = document.createElement("div");

    parent.appendChild(instance.$el);
    document.body.appendChild(parent);

    return new Promise<{ ok: true }>((resolve, reject) => {
      instance.$on("confirm", () => resolve({ ok: true }));
      instance.$on("cancel", () => reject({ ok: false }));
    }).finally(() => {
      instance.$destroy();
      document.body.removeChild(parent);
    });
  },
};
</script>

<style scoped></style>
