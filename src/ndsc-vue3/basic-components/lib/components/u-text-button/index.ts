import UTextButton from './u-text-button.vue'

UTextButton.install = function (Vue) {
  Vue.component(UTextButton.options.name, UTextButton)
}

export default UTextButton
