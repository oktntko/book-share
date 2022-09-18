<template>
  <RouterView />
</template>

<script lang="ts">
import axios, { AxiosError } from "axios";
import Vue from "vue";
import { $dialog } from "~/components/Dialog.vue";

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
        if (axios.isAxiosError(error) && isApiError(error)) {
          console.error(error);

          const status = error.response?.status ?? 0;
          const colorset =
            0 < status && status < 400
              ? "info"
              : 400 <= status && status < 500
              ? "warning"
              : "danger";

          $dialog.open({
            colorset,
            icon: colorset === "info" ? "bx:info-circle" : "bx:error",
            message: error.response?.data.message,
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

const isApiError = (error: AxiosError): error is AxiosError<{ message: string }> => {
  return (
    typeof error?.response?.data === "object" &&
    error.response.data != null &&
    "message" in error.response.data
  );
};
</script>
