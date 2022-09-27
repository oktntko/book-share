import Vue from "vue";
import dayjs from "~/libs/dayjs";

const TIMESTAMP = "YYYY-MM-DD HH:mm:ss";

function timestamp(value: unknown) {
  if (!value) {
    return "";
  } else if (typeof value === "string" || typeof value === "number") {
    const day = dayjs(value);
    if (day.isValid()) {
      return day.format(TIMESTAMP);
    } else {
      return value;
    }
  } else if (value instanceof Date) {
    return dayjs(value).format(TIMESTAMP);
  } else if (dayjs.isDayjs(value)) {
    return value.format(TIMESTAMP);
  } else {
    return value;
  }
}

Vue.filter("timestamp", timestamp);
