const customCache = new Set()

export default function loadJs(scriptUrl: string) {
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
