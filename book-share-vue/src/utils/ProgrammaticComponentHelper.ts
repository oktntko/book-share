/* eslint-disable vue/one-component-per-file */
import { createApp } from 'vue';
import MyLoading from '~/components/MyLoading.vue';
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
