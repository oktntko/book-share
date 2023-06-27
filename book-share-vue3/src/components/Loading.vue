<script lang="ts">
import { Icon } from "@iconify/vue";
import { defineComponent, nextTick, type PropType } from "vue";

interface CanCancel {
  escape: boolean;
  outside: boolean;
}

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    canCancel: {
      type: Object as PropType<CanCancel>,
      default: () => ({
        escape: true,
        outside: true,
      }),
    },
  },
  emits: ["close"],
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    this.open = true;

    document.addEventListener("keyup", this.handleEscapeKeyPress);
    document.getElementById("app")?.addEventListener("focusin", this.focusComponent);

    nextTick(() => {
      (this.$refs.refHiddenInput as HTMLInputElement | null)?.focus();
    });
  },
  beforeUnmount() {
    document.removeEventListener("keyup", this.handleEscapeKeyPress);
    document.getElementById("app")?.removeEventListener("focusin", this.focusComponent);
  },
  methods: {
    handleEscapeKeyPress(event: KeyboardEvent) {
      if (this.canCancel?.escape && event.key === "Escape") {
        this.close();
      }
    },
    handleOutsideClicked() {
      if (this.canCancel?.outside) {
        this.close();
      }
    },
    close() {
      this.open = false;
      setTimeout(() => this.$emit("close"), 200);
    },
    focusComponent() {
      (this.$refs.refHiddenInput as HTMLInputElement | null)?.focus();
    },
  },
});
</script>

<template>
  <div class="relative z-10" role="status">
    <!-- Overlay -->
    <Transition
      enter-from-class="transform opacity-0"
      enter-active-class="transition ease-out duration-200"
      enter-to-class="transform opacity-100"
      leave-from-class="transform opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-to-class="transform opacity-0"
    >
      <div
        v-show="open"
        class="fixed inset-0 flex h-full w-full items-center justify-center bg-gray-50/20 p-4 backdrop-blur-[1px] transition-opacity md:h-auto"
        @click="handleOutsideClicked"
      >
        <Icon
          icon="eos-icons:bubble-loading"
          class="h-16 w-16 text-gray-600 text-opacity-60 dark:text-gray-800 dark:text-opacity-60"
        />
        <span class="sr-only">Loading...</span>
        <input
          ref="refHiddenInput"
          class="border-none bg-transparent caret-transparent outline-none"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
