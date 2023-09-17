import type { App } from 'vue';
import MyLoading from '~/components/MyLoading.vue';
import type { ComponentProps } from '~/lib/utility-types';

type LoadingProps = ComponentProps<typeof MyLoading>;
type LoadingPlugin = ReturnType<typeof installLoadingPlugin>;

const LoadingPluginKey = Symbol() as InjectionKey<LoadingPlugin>;

export default function (parentApp: App) {
  const loading = installLoadingPlugin(parentApp);

  parentApp.config.globalProperties.$loading = loading;

  parentApp.provide<LoadingPlugin>(LoadingPluginKey, loading);
}

export function useLoading() {
  return inject<LoadingPlugin>(LoadingPluginKey)!;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $loading: LoadingPlugin;
  }
}

function installLoadingPlugin(parentApp: App) {
  return {
    open(props?: LoadingProps) {
      const parent = document.createElement('div');
      document.body.appendChild(parent);

      const app = createApp(MyLoading, {
        ...props,
        onClose: () => {
          app.unmount();
          document.body.removeChild(parent);
        },
      });

      // https://github.com/quasarframework/quasar/blob/dev/ui/src/install-quasar.js#L25
      app.config.globalProperties = parentApp.config.globalProperties;
      Object.assign(app._context, parentApp._context);

      const vm = app.mount(parent) as InstanceType<typeof MyLoading>;
      return {
        close: vm.close,
      };
    },
  };
}
