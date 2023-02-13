/**
 * 返回去除对象中的某些属性后的新对象
 * @param obj 目标对象
 * @param fields 忽略的属性数组
 */
export function omit<T, K extends string[]>(
  obj: T,
  fields: K
): Pick<T, { [P in keyof T]: P extends K ? never : P }[keyof T]> {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }

  return shallowCopy;
}

/**
 * 判断值是否为 undefined 或者 null
 * @param v 输入值
 */
export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

/**
 * 判断值是否为正整数
 * @param v 值
 */
export function isPositiveInteger(v: number): boolean {
  return typeof v === "number" && v % 1 === 0 && v > 0;
}

/**
 * 判断值是否为不小于 0 的整数
 * @param v 值
 */
export function isNoLessThanZeroInteger(v: number): boolean {
  return typeof v === "number" && v % 1 === 0 && v >= 0;
}

/**
 * 时间戳转时间格式
 * @param time 时间戳，毫秒
 */
export function getTimeStringFromTimestamp(time: number) {
  if (!time) return "";

  // 增加8小时
  const date = new Date(time + 8 * 3600 * 1000);

  return date.toJSON().substr(0, 19).replace("T", " ");
}

/**
 * 判断值是否为数组
 * @param 值
 */
export const isArray = (arr: any) => Array.isArray(arr);

/**
 * 判断值是否为对象
 * @param 值
 */
export const isObject = (obj: any) =>
  Object.prototype.toString.call(obj) === "[object Object]";

/**
 * 判断值是否为字符串
 * @param 值
 */
export const isString = (str: any) => typeof str === "string";

/**
 * 判断值是否为布尔
 * @param 值
 */
export const isBool = (bool: any) => typeof bool === "boolean";

/**
 * 判断值是否为数字
 * @param 值
 */
export const isNumber = (num: any) => typeof num === "number";

/**
 * 判断data是否有值，0、false、NaN也属于有值
 * @param 值
 */
export function hasData(data: any) {
  if (isArray(data)) return !!data.length;
  if (isObject(data)) return !!Object.keys(data).length;
  if (isString(data)) return !!data.trim().length;
  if (isBool(data)) return true;
  if (isNumber(data)) return true;

  return !!data;
}

/**
 * 生成唯一id
 */
export function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

/**
 * 复制字符串到剪贴板
 * * @param str 字符串
 */
export function copy(str: string) {
  const input = document.createElement("input");
  input.setAttribute("value", str);
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand("copy");
  document.body.removeChild(input);

  return result;
}

/**
 * 清除特定前缀的 localStorage
 * @param prefix 特定前缀
 */
export function clearStorageFromSpecifiedPrefix(prefix: string) {
  const allItems = Object.keys(localStorage);

  allItems.forEach((item) => {
    if (item.startsWith(prefix)) {
      localStorage.removeItem(item);
    }
  });
}
