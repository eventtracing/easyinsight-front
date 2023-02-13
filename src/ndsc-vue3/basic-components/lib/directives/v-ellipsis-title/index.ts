import VEllipsisTitle from './v-ellipsis-title'

export default {
  name: 'ellipsis-title',
  install: function (Vue: any) {
    Vue.directive('ellipsis-title', VEllipsisTitle)
  },
  ...VEllipsisTitle
}
