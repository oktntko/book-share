<template>
  <div class="relative z-10" role="status">
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
        class="fixed inset-0 flex h-full w-full items-center justify-center bg-gray-100 bg-opacity-10 p-4 backdrop-blur-[2px] transition-opacity md:h-auto"
        @click="handleOutsideClicked"
      >
        <Icon
          icon="eos-icons:bubble-loading"
          class="h-16 w-16 text-gray-600 text-opacity-60 dark:text-gray-800 dark:text-opacity-60"
        />
        <span class="sr-only">Loading...</span>
        <input ref="refHinddenInput" type="hidden" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

type LoadingProps = Partial<{
  canCancel: {
    escape: boolean;
    button: boolean;
    outside: boolean;
  };
}>;

const Loading = Vue.extend({
  props: {
    canCancel: {
      type: Object as PropType<{
        escape: boolean;
        outside: boolean;
      }>,
      required: false,
      default: () => ({
        escape: false,
        outside: false,
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

    this.$nextTick(() => {
      // $nextTick を入れないとフォーカスが移動しない
      (this.$refs.refHinddenInput as HTMLInputElement).focus();
    });
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
      setTimeout(() => this.$emit("close"), this.dissmissDuration);
    },
  },
});

export default Loading;

export const $loading = {
  open(propsData: LoadingProps = {}) {
    const instance = new Loading({ propsData }).$mount();
    const parent = document.createElement("div");

    parent.appendChild(instance.$el);
    document.body.appendChild(parent);

    instance.$on("close", () => {
      instance.$destroy();
      document.body.removeChild(parent);
    });

    return { close: instance.close };
  },
};
</script>

<style scoped></style>
