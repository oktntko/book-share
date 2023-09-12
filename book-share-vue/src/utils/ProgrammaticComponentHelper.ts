/* eslint-disable vue/one-component-per-file */
import { createApp, type App } from 'vue';
import MyDialog from '~/components/MyDialog.vue';
import MyLoading from '~/components/MyLoading.vue';
import MyModal from '~/components/MyModal.vue';
import MyToast from '~/components/MyToast.vue';
import type { ComponentProps } from '~/lib/utility-types';

////////////////////////////////
// ローディング
////////////////////////////////

type LoadingProps = ComponentProps<typeof MyLoading>;

export function openLoading(props?: LoadingProps) {
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const app = createApp(MyLoading, {
    ...props,
    onClose: () => {
      app.unmount();
      document.body.removeChild(parent);
    },
  });
  const vm = app.mount(parent) as InstanceType<typeof MyLoading>;

  return {
    close: vm.close,
  };
}

////////////////////////////////
// ダイアログ
////////////////////////////////

type DialogProps = Omit<ComponentProps<typeof MyDialog>, 'onConfirm' | 'onCancel'>;

export async function openDialog(props?: DialogProps) {
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  let app: App<Element>;
  return new Promise<boolean>((resolve) => {
    app = createApp(MyDialog, {
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

export async function openAlertDialog(message: string) {
  return openDialog({
    message,
    colorset: 'yellow',
    icon: 'bx:error',
    confirmText: 'OK',
    closeable: {
      button: false,
      escape: true,
      outside: true,
    },
  });
}

export async function openConfirmDialog(message: string) {
  return openDialog({
    message,
    colorset: 'yellow',
    icon: 'bx:info-circle',
    confirmText: 'OK',
    cancelText: 'やめる',
    closeable: {
      button: true,
      escape: true,
      outside: true,
    },
  });
}

////////////////////////////////
// トースト
////////////////////////////////

type ToastProps = Omit<ComponentProps<typeof MyToast>, 'onClose'>;

export async function openToast(props?: ToastProps) {
  const parent = document.createElement('div');

  const container = document.getElementById('toast-container');

  if (container) {
    container.appendChild(parent);
  } else {
    const container = document.createElement('div');
    container.setAttribute('id', 'toast-container');

    container.style.position = 'fixed';
    container.style.zIndex = '10';
    container.style.bottom = '3rem';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';

    container.appendChild(parent);
    document.body.appendChild(container);
  }

  const app = createApp(MyToast, {
    ...props,
    onClose: () => {
      app.unmount();
      const container = document.getElementById('toast-container');
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

export async function openSuccessToast(message: string) {
  return openToast({
    colorset: 'success',
    message,
  });
}

export async function openInfoToast(message: string) {
  return openToast({
    colorset: 'info',
    message,
  });
}

////////////////////////////////
// モーダル
////////////////////////////////

type ModalProps = Omit<ComponentProps<typeof MyModal>, 'onSuccess' | 'onClose'>;

export async function openModal<T>(props: ModalProps) {
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  let app: App<Element>;
  return new Promise<T | undefined>((resolve) => {
    app = createApp(MyModal, {
      ...props,
      onSuccess: (data: T) => {
        resolve(data);
      },
      onClose: () => {
        resolve(undefined);
      },
    });
    app.mount(parent);
  }).finally(() => {
    app.unmount();
    document.body.removeChild(parent);
  });
}
