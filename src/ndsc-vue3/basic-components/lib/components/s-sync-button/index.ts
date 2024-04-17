import SSyncButton from './s-sync-button.vue'

SSyncButton.install = function (Vue) {
  Vue.component(SSyncButton.options.name, SSyncButton)
}

export default SSyncButton
