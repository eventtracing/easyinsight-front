// @ts-nocheck
// eslint-disable-next-line
import { default as TopBar } from './Topbar.vue'

// Declare install function executed by Vue.use()
function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('TopBar', TopBar)
}

// Create module definition for Vue.use()
const plugin = {
  install
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = (global as any).Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

TopBar.install = install

// To allow use as module (npm/webpack/etc.) export component
export { TopBar }
export default TopBar
