import UStatusIcon from './u-status-icon.vue'

UStatusIcon.install = function (Vue) {
  Vue.component(UStatusIcon.options.name, UStatusIcon)
}

export default UStatusIcon
