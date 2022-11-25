// https://github.com/angus-c/just/blob/master/packages/collection-clone/index.js

/*
  Deep clones all properties except functions
  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

export function clone<T extends object>(obj: T): T {
  let result = obj;
  const type = {}.toString.call(obj).slice(8, -1);
  if (type == "Set") {
    // @ts-ignore
    return new Set([...obj].map((value) => clone(value)));
  }
  if (type == "Map") {
    // @ts-ignore
    return new Map([...obj].map((kv) => [clone(kv[0]), clone(kv[1])]));
  }
  if (type == "Date") {
    // @ts-ignore
    return new Date(obj.getTime());
  }
  if (type == "RegExp") {
    // @ts-ignore
    return RegExp(obj.source, getRegExpFlags(obj));
  }
  if (type == "Array" || type == "Object") {
    // @ts-ignore
    result = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      // include prototype properties
      // @ts-ignore
      result[key] = clone(obj[key]);
    }
  }
  // primitives and non-supported objects (e.g. functions) land here
  return result;
}

function getRegExpFlags(regExp: RegExp) {
  // @ts-ignore
  if (typeof regExp.source.flags == "string") {
    // @ts-ignore
    return regExp.source.flags;
  } else {
    const flags = [];
    regExp.global && flags.push("g");
    regExp.ignoreCase && flags.push("i");
    regExp.multiline && flags.push("m");
    regExp.sticky && flags.push("y");
    regExp.unicode && flags.push("u");
    return flags.join("");
  }
}
