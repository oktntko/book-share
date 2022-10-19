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
    <div class="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden" @click="handleOutsideClicked">
      <div class="relative">
        <!-- Dialog -->
        <transition
          enter-class="opacity-0 translate-x-16"
          enter-active-class="ease-out duration-200"
          enter-to-class="opacity-100 translate-x-0"
          leave-class="opacity-100 translate-x-0"
          :leave-active-class="`ease-in duration-${dissmissDuration}`"
          leave-to-class="opacity-0 translate-x-16"
        >
          <div
            v-show="open"
            class="absolute right-0 h-screen w-screen min-w-[640px] transform overflow-hidden bg-gray-50 shadow-xl transition-all lg:w-1/3"
            @click.stop
          >
            <component
              :is="component"
              v-if="component"
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

type SidemenuProps = Partial<{
  component: unknown;
  componentProps: unknown;
  componentEvents: unknown;
  htmlContent: string;
  canCancel: {
    escape: boolean;
    outside: boolean;
  };
}>;

const Sidemenu = Vue.extend({
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

export default Sidemenu;

export const $sidemenu = {
  open<T>(propsData: SidemenuProps) {
    const instance = new Sidemenu({ propsData }).$mount();
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
