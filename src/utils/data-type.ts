const toString = Object.prototype.toString;

export const isObject = (obj: any) => {
  return Object.is(toString.call(obj), '[object Object]');
};

export const isRegExp = (v: any) => {
  return Object.is(toString.call(v), '[object RegExp]');
};

export const isValidArrayIndex = (val: any) => {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
};

export const isString = (str: any) => {
  return Object.is(toString.call(str), '[object String]');
};
