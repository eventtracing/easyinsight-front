import { defineComponent } from 'vue'
import SelectDropdownMenu from './menu/VirtualMenu.vue'
import { SelectDropdownMenuData } from './menu/type'
import './select.less'
import { CloseCircleFilled } from '@ant-design/icons-vue'

function isNullOrUndefined(val: any) {
  return val === null || val === undefined
}

export default defineComponent({
  name: 'mm-filter-select',
  components: {
    'select-dropdown-menu': SelectDropdownMenu,
    CloseCircleFilled
  },
  props: {
    label: {},
    mode: {
      default: 'single'
    },
    selectOptions: {},
    searchable: {
      default: true
    },
    initValue: {},
    getPopupContainer: {
      default: () => {
        return () => document.body
      }
    },
    maxTagTextLength: {
      default: 4
    },
    maxTagCount: {
      default: 3
    },
    optionLabelProp: {
      default: 'value'
    },
    minInputWidth: {
      default: 120
    },
    titleKey: {
      default: 'value'
    },
    allowClear: {
      default: true
    },
    searchValue: {
      default: 'value'
    },
    alwaysShowDropdownIcon: {
      default: false
    }
  },

  data() {
    const _selected: SelectDropdownMenuData[] = []
    const _placeholder = ''
    const _visible = false
    const _searchKey = ''
    const _value = ''
    const _hiddenValue = ''
    return {
      selected: _selected,
      placeholder: _placeholder,
      visible: _visible,
      searchKey: _searchKey,
      value: _value,
      hiddenValue: _hiddenValue
    }
  },

  mounted() {
    this.$watch('initValue', this.updateValue, {
      deep: true,
      immediate: true
    })

    document.addEventListener('click', this.toggleHandler)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.toggleHandler)
  },

  methods: {
    processMultipleValue(items: SelectDropdownMenuData[]) {
      const str = items
        .slice(0, Number(this.maxTagCount))
        .map((o) => {
          const initItemString = String(o[this.optionLabelProp])
          return initItemString.length > Number(this.maxTagTextLength)
            ? initItemString.slice(0, Number(this.maxTagTextLength)) + '...'
            : initItemString
        })
        .join('，')

      if (items.length <= Number(this.maxTagCount)) {
        return str
      } else {
        return str + `，+${items.length - Number(this.maxTagCount)}...`
      }
    },

    findSelected(initValue: string[] | string | number | number[]) {
      this.selected = []
      let selected = []

      if (this.mode === 'single') {
        selected = this.selectOptions.filter((item: SelectDropdownMenuData) => {
          return item.key === initValue
        })
      } else {
        selected = this.selectOptions.filter((item: SelectDropdownMenuData) => {
          return (initValue as (string | number)[]).indexOf(item.key) !== -1
        })
      }

      this.selected = selected
    },

    toggleHandler(e: any) {
      const dropdownBox: any = this.$refs.dropdownBox as any
      const selectInputBox: Element = this.$refs.select as Element

      if (
        !selectInputBox.contains(e.target) &&
        dropdownBox &&
        !dropdownBox.$el.contains(e.target)
      ) {
        if (this.visible) {
          this.visible = false
        }
      }
    },

    openDropdown() {
      if (!this.visible) {
        this.visible = true
      }
    },

    focus() {
      this.openDropdown()

      if (this.value && this.searchable) {
        this.placeholder = this.value
        this.value = ''
        this.searchKey = ''
      }
    },

    input(e: any) {
      const value = e.target.value
      this.value = value
      this.searchKey = value.replace(/^(\s+)|(\s+)$/, '')
    },

    handleValue() {
      this.value = this.label ? this.label + '：' : ''

      if (this.mode === 'multiple') {
        if (!this.selected.length) {
          this.value += '全部'
        } else {
          this.value += this.processMultipleValue(this.selected)
        }
      } else {
        this.value += this.selected.length
          ? this.selected[0][this.optionLabelProp].length > Number(this.maxTagTextLength)
            ? this.selected[0][this.optionLabelProp].slice(0, Number(this.maxTagTextLength)) + '...'
            : this.selected[0][this.optionLabelProp]
          : '全部'
      }
    },

    selectItem(selected: SelectDropdownMenuData[]) {
      this.selected = selected
      if (this.mode === 'single') {
        this.visible = false
      }
      this.$emit('changeSelect', this.selected)
    },

    clearSelected() {
      this.selected = []
      if (this.mode === 'single') {
        this.visible = false
      }

      this.$emit('changeSelect', this.selected)
    },

    renderDropdownIcon(showClearIcon: boolean) {
      if (this.alwaysShowDropdownIcon || !this.selected.length) {
        return (
          <u-icon-font
            type="select-arrow"
            class={['icon-down', showClearIcon && 'hide-icon-down']}
          />
        )
      }

      return ''
    },

    updateValue(n) {
      this.value = this.label ? this.label + '：' : ''

      if (!this.selectOptions || !this.selectOptions.length) {
        this.value += '全部'
      } else {
        if (this.mode === 'single') {
          if (isNullOrUndefined(this.initValue)) {
            this.value += '全部'
            this.selected = []
          } else {
            const initValueItem = this.selectOptions.filter((o) => o.key === this.initValue)[0]
            const initString = initValueItem ? String(initValueItem[this.optionLabelProp]) : ''
            this.value +=
              initString.length > Number(this.maxTagTextLength)
                ? initString.slice(0, Number(this.maxTagTextLength)) + '...'
                : initString
            this.findSelected(this.initValue)
          }
        }

        if (this.mode === 'multiple') {
          const initValue = this.initValue as number[] | string[]

          if (!initValue || !initValue.length) {
            this.value += '全部'
            this.selected = []
          } else {
            const initValueItems = this.selectOptions.filter(
              (o) => (initValue as (string | number)[]).indexOf(o.key) > -1
            )
            this.value += this.processMultipleValue(initValueItems)
            this.findSelected(this.initValue)
          }
        }
      }

      this.hiddenValue = this.value
    },
    updateVisible(newVisible: boolean, oldVisible: boolean) {
      if (oldVisible === true && newVisible === false) {
        this.handleValue()
      }
    }
  },
  watch: {
    selectOptions: {
      handler: 'updateValue'
    },
    visible: {
      handler: 'updateVisible'
    }
  },
  render() {
    const slot = {
      overlay: () => (
        <select-dropdown-menu
          ref="dropdownBox"
          data={this.selectOptions}
          modes={this.mode}
          filterKey={this.searchKey}
          filterValue={this.searchValue}
          initSelected={this.selected.map((o) => o.key)}
          select={this.selectItem}
          titleKey={this.titleKey || 'value'}
        />
      )
    }
    const triBoxClass = this.visible ? 'mm-filter-tribox focus' : 'mm-filter-tribox'
    const isAll = this.selected && this.selected.length === 1 && this.selected[0].isAll
    const showClearIcon = !!this.selected.length && this.allowClear && !isAll
    return (
      <div class="mm-select" ref="select">
        <a-dropdown
          v-slots={slot}
          trigger={['click']}
          visible={this.visible}
          minOverlayWidthMatchTrigger={false}
          getPopupContainer={this.getPopupContainer}
        >
          <div class={triBoxClass}>
            <div style="display: inline-block;">
              <div style="display: inline-block; opacity: 0;padding:0 32px 0 8px;pointer-events: none">
                {this.hiddenValue}
              </div>
              <span style="position: absolute; left: 0; right: 0">
                <a-input
                  placeholder={this.placeholder}
                  value={this.value}
                  class="filter-input"
                  read-only={!this.searchable}
                  onClick={this.openDropdown.bind(this)}
                  onFocus={this.focus.bind(this)}
                  onInput={this.input.bind(this)}
                />
                {this.renderDropdownIcon(showClearIcon)}
                {showClearIcon && (
                  <CloseCircleFilled class="icon-close" onClick={this.clearSelected.bind(this)} />
                )}
              </span>
            </div>
          </div>
        </a-dropdown>
      </div>
    )
  }
})
