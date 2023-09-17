import type { App } from 'vue';
import MyModal from '~/components/MyModal.vue';
import type { ComponentProps } from '~/lib/utility-types';

type ModalProps = Omit<ComponentProps<typeof MyModal>, 'onSuccess' | 'onClose'>;
type ModalPlugin = ReturnType<typeof installModalPlugin>;

const ModalPluginKey = Symbol() as InjectionKey<ModalPlugin>;

export default function (parentApp: App) {
  const modal = installModalPlugin(parentApp);

  parentApp.config.globalProperties.$modal = modal;

  parentApp.provide<ModalPlugin>(ModalPluginKey, modal);
}

export function useModal() {
  return inject<ModalPlugin>(ModalPluginKey)!;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $modal: ModalPlugin;
  }
}

function installModalPlugin(parentApp: App) {
  return {
    async open<T>(props?: ModalProps) {
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

        // https://github.com/quasarframework/quasar/blob/dev/ui/src/install-quasar.js#L25
        app.config.globalProperties = parentApp.config.globalProperties;
        Object.assign(app._context, parentApp._context);

        app.mount(parent);
      }).finally(() => {
        app.unmount();
        document.body.removeChild(parent);
      });
    },
  };
}
