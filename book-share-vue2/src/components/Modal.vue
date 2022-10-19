<!-- eslint-disable vue/no-v-html -->
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
      <div v-show="open" class="fixed inset-0 bg-gray-400/50 transition-opacity"></div>
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
            :class="`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8
              ${container ? 'container' : 'sm:w-full sm:max-w-lg'}`"
            @click.stop
          >
            <component
              :is="component"
              v-if="component"
              class="p-4"
              v-bind="componentProps"
              v-on="componentEvents"
              @close="close"
              @success="success"
            />
            <template v-else-if="htmlContent">
              <div v-html="htmlContent" />
            </template>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

type ModalProps = Partial<{
  component: unknown;
  componentProps: unknown;
  componentEvents: unknown;
  htmlContent: string;
  canCancel: {
    escape: boolean;
    outside: boolean;
  };
  container: boolean;
}>;

const Modal = Vue.extend({
  props: {
    component: {
      type: [Object, Function, String],
      required: false,
      default: null,
    },
    componentProps: {
      type: [Object, Function, String],
      required: false,
      default: null,
    },
    componentEvents: {
      type: [Object],
      required: false,
      default: null,
    },
    htmlContent: {
      type: [String, Array],
      required: false,
      default: null,
    },
    canCancel: {
      type: Object as PropType<{
        escape: boolean;
        outside: boolean;
      }>,
      required: false,
      default: () => ({
        escape: true,
        outside: true,
      }),
    },
    container: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      open: false,
      dissmissDuration: 200 /*ms*/,
    };
  },
  mounted() {
    this.open = true;

    document.addEventListener("keyup", this.handleEscapeKeyPress);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.handleEscapeKeyPress);
  },
  methods: {
    handleEscapeKeyPress(event: KeyboardEvent) {
      if (this.canCancel.escape && event.key === "Escape") {
        this.close();
      }
    },
    handleOutsideClicked() {
      if (this.canCancel.outside) {
        this.close();
      }
    },

    close() {
      this.open = false;
      setTimeout(() => {
        this.$emit("close");
        this.componentEvents?.close?.();
      }, this.dissmissDuration);
    },
    success(data: any) {
      this.open = false;
      setTimeout(() => {
        this.$emit("success", data);
        this.componentEvents?.success?.(data);
      }, this.dissmissDuration);
    },
  },
});

export default Modal;

export const $modal = {
  open<T>(propsData: ModalProps) {
    const instance = new Modal({ propsData }).$mount();
    const parent = document.createElement("div");

    parent.appendChild(instance.$el);
    document.body.appendChild(parent);

    return new Promise<T>((resolve, reject) => {
      instance.$on("success", resolve);
      instance.$on("close", () => reject({ ok: false }));
    }).finally(() => {
      instance.$destroy();
      document.body.removeChild(parent);
    });
  },
};
</script>

<style scoped></style>
