import { Icon } from "@iconify/vue";
import { createApp } from "vue";
import App from "~/App.vue";
import "~/assets/main.css";
import "~/libs/dayjs";
import "~/libs/zod";
import router from "~/middleware/router";
import { isRouterError } from "~/middleware/trpc";
import { openDialog } from "~/utils/ProgrammaticComponentHelper";

const app = createApp(App);

// Plugins
app.use(router);

app.component("Icon", Icon);

app.mount("#app");

function handleError(error: unknown) {
  if (isRouterError(error)) {
    const status = error.data?.httpStatus ?? 0;
    const colorset =
      0 < status && status < 400 ? "blue" : 400 <= status && status < 500 ? "yellow" : "red";

    if (status === 401 /*UNAUTHORIZED*/ || status === 403 /*FORBIDDEN*/) {
      router.replace("/login");
    }

    return openDialog({
      colorset,
      icon: colorset === "blue" ? "bx:info-circle" : "bx:error",
      message: error.message,
      confirmText: "OK",
      closeable: {
        escape: true,
        button: false,
        outside: true,
      },
    });
  } else {
    console.error(error);
  }
}

window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
  event.promise.catch(handleError);
});

app.config.errorHandler = handleError;
