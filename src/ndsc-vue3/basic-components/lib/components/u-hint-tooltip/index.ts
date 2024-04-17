import UHintTooltip from './u-hint-tooltip.vue'

UHintTooltip.install = function (Vue) {
  Vue.component(UHintTooltip.options.name, UHintTooltip)
}

export default UHintTooltip
