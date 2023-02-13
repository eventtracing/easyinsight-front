import VCopy from './v-copy'

export default {
  name: 'copy',
  install: function (Vue: any) {
    Vue.directive('copy', VCopy)
  },
  ...VCopy
}
