import VInputNumber from './v-input-number'

export default {
  name: 'input-number',
  install: function (Vue: any) {
    Vue.directive('input-number', VInputNumber)
  },
  ...VInputNumber
}
