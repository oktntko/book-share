import type { App } from 'vue';
import MyToast from '~/components/MyToast.vue';
import type { ComponentProps } from '~/lib/utility-types';

type ToastProps = Omit<ComponentProps<typeof MyToast>, 'onClose'>;
type ToastPlugin = ReturnType<typeof installToastPlugin>;

const ToastPluginKey = Symbol() as InjectionKey<ToastPlugin>;

export default function (parentApp: App) {
  const toast = installToastPlugin(parentApp);

  parentApp.config.globalProperties.$toast = toast;

  parentApp.provide<ToastPlugin>(ToastPluginKey, toast);
}

export function useToast() {
  return inject<ToastPlugin>(ToastPluginKey)!;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $toast: ToastPlugin;
  }
}

function installToastPlugin(parentApp: App) {
  return {
    async open(props?: ToastProps) {
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

      // https://github.com/quasarframework/quasar/blob/dev/ui/src/install-quasar.js#L25
      app.config.globalProperties = parentApp.config.globalProperties;
      Object.assign(app._context, parentApp._context);

      app.mount(parent);
    },

    async success(message: string) {
      return this.open({
        message,
        colorset: 'success',
      });
    },

    async info(message: string) {
      return this.open({
        message,
        colorset: 'info',
      });
    },
  };
}
