import App from '~/App.vue';
import router from '~/lib/router';
import { isRouterError } from '~/lib/trpc';
import '~/main.css';
import DialogPlugin from '~/plugin/DialogPlugin';
import LoadingPlugin from '~/plugin/LoadingPlugin';
import ModalPlugin from '~/plugin/ModalPlugin';
import ToastPlugin from '~/plugin/ToastPlugin';
import WindowPlugin from '~/plugin/WindowPlugin';
import { useAuthStore } from '~/store/AuthStore';

const app = createApp(App);

app.use(createPinia());

// pinia をインストールしてからでないと使えないため順番は大事
const { fetchAuth } = useAuthStore();
router.afterEach(fetchAuth);
app.use(router);

app.use(WindowPlugin);
app.use(DialogPlugin);
app.use(LoadingPlugin);
app.use(ModalPlugin);
app.use(ToastPlugin);

app.mount('#app');

function handleError(error: unknown) {
  if (isRouterError(error)) {
    const status = error.data?.httpStatus ?? 0;
    const colorset =
      0 < status && status < 400 ? 'blue' : 400 <= status && status < 500 ? 'yellow' : 'red';

    if (status === 401 /*UNAUTHORIZED*/ || status === 403 /*FORBIDDEN*/) {
      router.replace('/login');
    }

    return app.config.globalProperties.$dialog.open({
      colorset,
      icon: colorset === 'blue' ? 'bx:info-circle' : 'bx:error',
      message: error.message,
      confirmText: 'OK',
    });
  } else {
    console.error(error);
  }
}

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  event.promise.catch(handleError);
});

app.config.errorHandler = handleError;

/**
 * 機能面
 * - 投稿をストックする機能
 * - 投稿にハートをつける機能
 * - 本を探すから投稿を探すのリンクがうまくいってない
 * - ランキングから本を探すのときと同じようにメニューを出す
 * - 本を読んだだけじゃなくて本を読みたいもあり
 * - 読んだ本の一覧、テーブルでよくないか？
 * - Google Analytics を入れる
 */
if (import.meta.env.MODE === 'github-pages') {
  const { worker } = await import('./mock/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
