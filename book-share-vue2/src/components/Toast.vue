<template>
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
      class="mt-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow-md dark:bg-gray-800 dark:text-gray-400"
      :class="
        color === 'green'
          ? 'bg-green-100 dark:bg-green-800'
          : color === 'yellow'
          ? 'bg-yellow-100 dark:bg-yellow-800'
          : color === 'red'
          ? 'bg-red-100 dark:bg-red-800'
          : 'bg-blue-100 dark:bg-blue-800'
      "
      role="alert"
      @click.stop
    >
      <div
        v-if="icon"
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
        :class="
          color === 'green'
            ? ' text-green-500 dark:text-green-200'
            : color === 'yellow'
            ? ' text-yellow-500 dark:text-yellow-200'
            : color === 'red'
            ? ' text-red-500 dark:text-red-200'
            : ' text-blue-500 dark:text-blue-200'
        "
      >
        <Icon class="h-5 w-5" :icon="icon" />
        <span class="sr-only">Icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">{{ message }}</div>
      <button
        type="button"
        class="-mx-1.5 -my-1.5 ml-4 inline-flex h-8 w-8 rounded-lg bg-transparent p-1.5 text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
        data-dismiss-target="#toast-default"
        aria-label="Close"
        @click="close"
      >
        <Icon class="h-5 w-5" icon="bi:x" />
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

type ToastProps = Partial<{
  type: "info" | "success" | "warning" | "danger";
  message: string;
  duration: number;
}>;

const Toast = Vue.extend({
  props: {
    type: {
      type: String,
      required: false,
      default: "info",
      validator: (value: unknown) =>
        typeof value === "string" && ["info", "success", "warning", "danger", ""].includes(value),
    },
    message: {
      type: String,
      required: false,
      default: "",
    },
    duration: {
      type: Number,
      required: false,
      default: 2000 /*ms*/,
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
      if (this.type === "success") {
        return "green";
      } else if (this.type === "warning") {
        return "yellow";
      } else if (this.type === "danger") {
        return "red";
      } else {
        return "blue";
      }
    },
    icon(): string {
      if (this.type === "success") {
        return "bx:check";
      } else if (this.type === "warning") {
        return "bx:info-circle";
      } else if (this.type === "danger") {
        return "bx:info-circle";
      } else {
        return "bx:error";
      }
    },
  },
  mounted() {
    this.open = true;
    if (this.duration) {
      setTimeout(this.close, this.duration);
    }
  },
  methods: {
    close() {
      this.open = false;
      setTimeout(() => this.$emit("close"), this.dissmissDuration);
    },
  },
});

export default Toast;

export const $toast = {
  open(propsData: ToastProps) {
    const instance = new Toast({ propsData }).$mount();
    const parent = document.createElement("div");

    parent.appendChild(instance.$el);

    let container = document.getElementById("toast-container");
    if (container) {
      container.appendChild(parent);
    } else {
      container = document.createElement("div");
      container.setAttribute("id", "toast-container");

      container.style.position = "fixed";
      container.style.zIndex = "10";
      container.style.bottom = "3rem";
      container.style.left = "50%";

      container.appendChild(parent);
      document.body.appendChild(container);
    }

    return new Promise<{ ok: true }>((resolve) => {
      instance.$on("close", () => resolve({ ok: true }));
    }).finally(() => {
      instance.$destroy();
      if (container) {
        container.removeChild(parent);

        if (!container.hasChildNodes()) {
          document.body.removeChild(container);
        }
      }
    });
  },
};
</script>

<style scoped></style>
