// @ts-nocheck
import UPage403 from './u-page403.vue'
import UPage404 from './u-page404.vue'
import UPageNoBiz from './u-page-nobiz.vue'

let Vue

function install(_Vue) {
  if (Vue && _Vue === Vue) {
    return
  }
  Vue = _Vue
  Vue.component('u-page403', UPage403)
  Vue.component('u-page404', UPage404)
  Vue.component('u-page-nobiz', UPageNoBiz)
}

const plugin = {
  install
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

UPage403.install = install
UPage404.install = install
UPageNoBiz.install = install

export { UPage403, UPage404, UPageNoBiz }
