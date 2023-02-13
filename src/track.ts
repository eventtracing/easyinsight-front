/**
 * PV 埋点装饰器
 * @param id 页面id
 * @returns 日志上报代码注入函数
 */
export const PV = (id) => {
  return (target) => {
    ;(target.options.mounted || (target.options.mounted = [])).push(() => {
      window.DATracker && window.DATracker.track && window.DATracker.track(id)
    })
  }
}

/**
 * PV 埋点
 * @param id 页面id
 * @param data 上报数据
 */
export const trackPage = (id, data = {}) => {
  window.DATracker && window.DATracker.track && window.DATracker.track(id, data)
}

/**
 * 日志上报
 * @param id 事件id
 * @param data 上报数据
 */
export const trackEvent = (id, data = {}) => {
  window.DATracker && window.DATracker.track && window.DATracker.track(id, data)
}
