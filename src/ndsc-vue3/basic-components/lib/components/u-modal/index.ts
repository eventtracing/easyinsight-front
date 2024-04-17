import UModal from './u-modal.vue'

UModal.install = function (Vue) {
  Vue.component(UModal.options.name, UModal)
}

export default UModal
