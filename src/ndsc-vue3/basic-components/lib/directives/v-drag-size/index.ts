import VDragSize from './v-drag-size'
import './v-drag-size.less'

export default {
  name: 'drag-size',
  install: function (Vue: any) {
    Vue.directive('drag-size', VDragSize)
  },
  ...VDragSize
}
