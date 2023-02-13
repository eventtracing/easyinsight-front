/**
 * 判断 url 是否是绝对路径
 * @param url url 字符串
 */
export function isAbsoluteURL(url: string) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

/**
 * 返回基础路径或拼接后的路径
 * @param baseURL 基础路径
 * @param relativeURL 相对路径
 */
export function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 获取url的query参数
 * @param name 参数名
 * @param url url 字符串
 */
export function getQueryString(name: string, url: string) {
  const arr = url.split('?')
  if (arr.length) {
    const search = arr[arr.length - 1]
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = search.match(reg)
    if (r != null) {
      return unescape(r[2])
    }
  }
  return null
}
