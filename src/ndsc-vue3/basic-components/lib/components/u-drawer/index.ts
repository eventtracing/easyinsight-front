import UDrawer from './u-drawer.vue'

UDrawer.install = function (Vue) {
  Vue.component(UDrawer.options.name, UDrawer)
}

export default UDrawer
