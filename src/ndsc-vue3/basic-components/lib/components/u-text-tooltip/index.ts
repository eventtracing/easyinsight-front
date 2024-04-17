import UTextTooltip from './u-text-tooltip.vue'

UTextTooltip.install = function (Vue) {
  Vue.component(UTextTooltip.options.name, UTextTooltip)
}

export default UTextTooltip
