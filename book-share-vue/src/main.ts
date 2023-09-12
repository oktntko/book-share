import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/App.vue';
import '~/assets/main.css';
import '~/lib/dayjs';
import { isRouterError } from '~/lib/trpc';
import { useTable } from '~/lib/vxe-table';
import '~/lib/zod';
import router from '~/middleware/router';
import { openDialog } from '~/utils/ProgrammaticComponentHelper';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(useTable);

app.mount('#app');

function handleError(error: unknown) {
  if (isRouterError(error)) {
    const status = error.data?.httpStatus ?? 0;
    const colorset =
      0 < status && status < 400 ? 'blue' : 400 <= status && status < 500 ? 'yellow' : 'red';

    if (status === 401 /*UNAUTHORIZED*/ || status === 403 /*FORBIDDEN*/) {
      router.replace('/login');
    }

    return openDialog({
      colorset,
      icon: colorset === 'blue' ? 'bx:info-circle' : 'bx:error',
      message: error.message,
      confirmText: 'OK',
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

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  event.promise.catch(handleError);
});

app.config.errorHandler = handleError;
