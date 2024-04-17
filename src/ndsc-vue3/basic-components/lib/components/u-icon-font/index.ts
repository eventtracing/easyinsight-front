import UIconFont from './u-icon-font.vue'

UIconFont.install = function (Vue) {
  Vue.component(UIconFont.options.name, UIconFont)
}

export default UIconFont
