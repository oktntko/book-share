/* eslint-disable vue/one-component-per-file */
import { createApp, type App } from "vue";
import Dialog from "~/components/Dialog.vue";
import Loading from "~/components/Loading.vue";
import Toast from "~/components/Toast.vue";
import type { ComponentProps } from "~/utility-types";

type LoadingProps = ComponentProps<typeof Loading>;

export function openLoading(props?: LoadingProps) {
  const parent = document.createElement("div");
  document.body.appendChild(parent);

  const app = createApp(Loading, {
    ...props,
    onClose: () => {
      app.unmount();
      document.body.removeChild(parent);
    },
  });
  const vm = app.mount(parent) as InstanceType<typeof Loading>;

  return {
    close: vm.close,
  };
}

type DialogProps = Omit<
  ComponentProps<typeof Dialog>,
  "onConfirm" | "onCancel"
>;

export async function openDialog(props?: DialogProps) {
  const parent = document.createElement("div");
  document.body.appendChild(parent);

  let app: App<Element>;
  return new Promise<boolean>((resolve) => {
    app = createApp(Dialog, {
      ...props,
      onConfirm: () => {
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      },
    });
    app.mount(parent);
  }).finally(() => {
    app.unmount();
    document.body.removeChild(parent);
  });
}

type ToastProps = Omit<ComponentProps<typeof Toast>, "onClose">;

export async function openToast(props?: ToastProps) {
  const parent = document.createElement("div");

  const container = document.getElementById("toast-container");

  if (container) {
    container.appendChild(parent);
  } else {
    const container = document.createElement("div");
    container.setAttribute("id", "toast-container");

    container.style.position = "fixed";
    container.style.zIndex = "10";
    container.style.bottom = "3rem";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";

    container.appendChild(parent);
    document.body.appendChild(container);
  }

  const app = createApp(Toast, {
    ...props,
    onClose: () => {
      app.unmount();
      const container = document.getElementById("toast-container");
      if (container) {
        container.removeChild(parent);

        if (!container.hasChildNodes()) {
          document.body.removeChild(container);
        }
      }
    },
  });
  app.mount(parent);
}
