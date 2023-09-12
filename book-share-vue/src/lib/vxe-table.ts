import type { App } from 'vue';
import VXETable from 'vxe-table';
import ja_JP from 'vxe-table/lib/locale/lang/ja-JP';
import 'vxe-table/lib/style.css';
import XEUtils from 'xe-utils';

VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(ja_JP, key), args),
});

export function useTable(app: App) {
  app.use(VXETable);
}
