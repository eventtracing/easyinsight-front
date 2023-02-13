import UCopy from './u-copy.vue'

UCopy.install = function (Vue) {
  Vue.component(UCopy.options.name, UCopy)
}

export default UCopy
