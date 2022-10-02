import Vue from "vue";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import ja_JP from "vxe-table/packages/locale/lang/ja-JP";
import XEUtils from "xe-utils";
import "~/styles/custom-vxe-table.css";

VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(ja_JP, key), args),
});

VXETable.formats.mixin({
  formatDate({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || "yyyy-MM-dd");
  },
  formatDatetime({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || "yyyy-MM-dd HH:mm:ss");
  },
  formatPrice({ cellValue }) {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(cellValue);
  },
  formatAmount({ cellValue }) {
    return new Intl.NumberFormat("ja-JP", {}).format(cellValue);
  },
});

Vue.use(VXETable);

export default VXETable;
