import * as R from 'remeda';

export function orderArray<T extends object>(arr: T[], order: number[], key: keyof T) {
  // order の順番に並び替える
  const orderedArray = R.compact(order.map((id) => arr.find((data) => data[key] === id)));
  // order になかったデータを抽出する
  const notfoundArray = R.difference(arr, orderedArray);

  return [...orderedArray, ...notfoundArray];
}
