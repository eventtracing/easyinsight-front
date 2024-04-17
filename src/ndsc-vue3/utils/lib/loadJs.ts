/**
 * 动态加载 js 文件
 */
const customCache = new Set()

/**
 * 动态引入 js
 * @param scriptUrl 脚本 url
 */
export function loadJs(scriptUrl: string) {
  if (
    typeof document !== 'undefined' &&
    typeof window !== 'undefined' &&
    typeof document.createElement === 'function' &&
    typeof scriptUrl === 'string' &&
    scriptUrl.length &&
    !customCache.has(scriptUrl)
  ) {
    const script = document.createElement('script')
    script.setAttribute('src', scriptUrl)
    script.setAttribute('data-namespace', scriptUrl)
    customCache.add(scriptUrl)
    document.body.appendChild(script)
  }
}
