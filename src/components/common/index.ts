import UDividerDash from './u-divider-dash.vue'
import UDivider from './u-divider.vue'
import UFilterSelect from './u-filter-select.vue'
import USingleSelect from './u-single-select.vue'
import USpinner from './u-spinner.vue'
import UTag from './u-tag.vue'
import UDrawFooter from './m-drawer-footer/index.vue'
import UIconFont from './m-icon-font/index.vue'
import RowSelectionTable from './m-rowselect-table/index.vue'

export default {
  install(Vue) {
    Vue.component(UDividerDash.name, UDividerDash)
    Vue.component(UDivider.name, UDivider)
    Vue.component(UFilterSelect.name, UFilterSelect)
    Vue.component(USingleSelect.name, USingleSelect)
    Vue.component(USpinner.name, USpinner)
    Vue.component(UTag.name, UTag)
    Vue.component(UDrawFooter.name, UDrawFooter)
    Vue.component(UIconFont.name, UIconFont)
    Vue.component(RowSelectionTable.name, RowSelectionTable)
  }
}
