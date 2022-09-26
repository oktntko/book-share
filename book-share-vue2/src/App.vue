<template>
  <RouterView />
</template>

<script lang="ts">
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";
import { isTRPCClientError } from "~/libs/trpc";

export default Vue.extend({
  mounted() {
    window.addEventListener("unhandledrejection", this.onUnhandledRejection);
  },
  beforeDestroy() {
    window.removeEventListener("unhandledrejection", this.onUnhandledRejection);
  },
  methods: {
    onUnhandledRejection(event: PromiseRejectionEvent) {
      event.promise.catch((error) => {
        if (isTRPCClientError(error)) {
          const status = error.data?.httpStatus ?? 0;
          const colorset =
            0 < status && status < 400
              ? "info"
              : 400 <= status && status < 500
              ? "warning"
              : "danger";

          $dialog.open({
            colorset,
            icon: colorset === "info" ? "bx:info-circle" : "bx:error",
            message: error.message,
            confirmText: "OK",
            canCancel: {
              escape: true,
              button: false,
              outside: true,
            },
          });
        } else {
          console.error(error);
        }
      });
    },
  },
});
</script>
