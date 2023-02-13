import VClickOutside from './v-click-outside'

export default {
  name: 'click-outside',
  install: function (Vue: any) {
    Vue.directive('click-outside', VClickOutside)
  },
  ...VClickOutside
}
