import UIconButton from './u-icon-button.vue'

UIconButton.install = function (Vue) {
  Vue.component(UIconButton.options.name, UIconButton)
}

export default UIconButton
