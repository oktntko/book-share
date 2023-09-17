/* eslint-disable vue/one-component-per-file */
import { createApp } from 'vue';
import MyLoading from '~/components/MyLoading.vue';
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
