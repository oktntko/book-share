import dayjs from 'dayjs';
import 'dayjs/locale/ja.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import duration from 'dayjs/plugin/duration.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import minMax from 'dayjs/plugin/minMax.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.locale('ja');
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);
dayjs.extend(relativeTime);

export { dayjs };
