/**
 * 函数节流，连续触发的事件以一定的频率执行，可以选择是否需要响应事件刚开始的那次回调（配置 leading 参数），以及事件结束后的那次回调（配置 trailing 参数）
 * 函数节流有三种调用方式，默认的（有头有尾），设置 {leading: false} 的，以及设置 {trailing: false} 的
 * @param {*} func 节流的函数
 * @param {*} delay 节流延迟
 * @param {*} options 设置leading 和 trailing 参数，不能同时配置
 */
export const throttle = function (
  func: Function,
  delay = 100,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {}
) {
  let timeoutId: number | null, context: any, result: any
  let lastExec = 0 // 上次执行时间

  return function (...args: any) {
    // @ts-ignore
    context = this
    const interval = Date.now() - lastExec

    function exec() {
      lastExec = Date.now()
      result = func.apply(context, args)
      timeoutId && clearTimeout(timeoutId)
      context = args = timeoutId = null
    }

    function clear() {
      timeoutId = null
    }

    options.leading !== false && interval > delay && exec()

    if (!timeoutId) {
      const wait = interval > delay ? delay : delay - interval
      // @ts-ignore
      timeoutId = setTimeout(options.trailing === false ? clear : exec, wait)
    }

    return result
  }
}

export function isUrlActive(url: string) {
  if (!url) {
    return false
  }
  if (url.startsWith('http')) {
    const origin = url.split('?')[0]
    return origin && location.href.startsWith(origin)
  } else {
    const path = url.split('?')[0]
    return path && location.pathname.startsWith(path)
  }
}

export function groupBy<T = any>(arr: T[], handle: (item: T) => string): { [k: string]: T[] } {
  const result: { [k: string]: T[] } = {}

  arr.forEach((item) => {
    const key = handle(item)

    if (result[key] === undefined) {
      result[key] = []
    }

    result[key].push(item)
  })

  return result
}
