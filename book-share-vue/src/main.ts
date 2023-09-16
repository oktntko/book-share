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

/**
 * vue create component programmatically
 *
 * 課題①: 作成したときに store などの状態が引き継がれない
 * 解決方法: QUASAR を真似してみる
 * - https://github.com/quasarframework/quasar/blob/dev/ui/src/plugins/Dialog.js
 *   - ダイアログプラグインをインストール
 * - https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/private/global-dialog.js
 *  - createChildApp
 *    - https://github.com/quasarframework/quasar/blob/dev/ui/src/install-quasar.js
 *      - vue#createApp で子アプリを作る
 *      - 親アプリから子アプリにコンテキストを渡す ⭐ここが重要と思われる⭐
 * やること:
 *  - そもそも store を使っていないので、 store を使ってログイン状態を管理する
 *  - モーダルを使って store が引き継がれないことを確認する
 *  - プラグインのやり方にする必要がある？
 *  - モーダルコンポーネントを作るときに、親アプリから子アプリにコンテキストを渡す ⭐ここが重要と思われる⭐
 *
 * 課題②: 複数作成したときにスタックを管理していない
 *  - モーダルの場合
 *    1. １個目を作る
 *    2. ２個目を作る
 *    3. １個目をエスケープキーで閉じる
 *      => ２個目も閉じる
 * 解決方法: ref とか使えばいい？？
 *
 * 機能面
 * - ユーザ管理機能を消す
 *    - プロフィール管理機能にする
 *    - はじめてのサインアップ機能
 *    - 二要素認証
 *    - 自分のユーザを削除する機能
 * - 投稿をストックする機能
 * - 投稿にハートをつける機能
 * - 本を探すから投稿を探すのリンクがうまくいってない
 * - ランキングから本を探すのときと同じようにメニューを出す
 * - 本を読んだだけじゃなくて本を読みたいもあり
 * - 読んだ本の一覧、テーブルでよくないか？
 * - Google Analytics を入れる
 */
