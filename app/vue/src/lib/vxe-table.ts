import type { App } from 'vue';
import type { VxeColumnProps, VxeColumnPropTypes, VxeTableDataRow } from 'vxe-table';
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

type ExtendsVxeColumnProps<D = VxeTableDataRow> = Omit<VxeColumnProps<D>, 'field'> & {
  field?: Paths<Omit<D, 'created_at' | 'updated_at'>> | 'created_at' | 'updated_at';
};
interface ExtendsColumnOptions<D = VxeTableDataRow> extends ExtendsVxeColumnProps<D> {
  children?: ExtendsColumnOptions<D>[];
  slots?: VxeColumnPropTypes.Slots<D>;
}
export type ExtendsColumns<D = VxeTableDataRow> = ExtendsColumnOptions<D>[];
