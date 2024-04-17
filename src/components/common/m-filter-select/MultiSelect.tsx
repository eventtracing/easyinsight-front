import { defineComponent } from 'vue'
import { Input, Dropdown } from 'ant-design-vue'
import SelectDropdownMenu from './menu/VirtualMenu.vue'
import { SelectDropdownMenuData } from './menu/type'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import './select.less'
export default defineComponent({
  name: 'mm-multi-select',
  components: {
    'a-input': Input,
    'a-dropdown': Dropdown,
    CloseCircleOutlined,
    'select-dropdown-menu': SelectDropdownMenu
  },
  props: {
    selectOptions: {},
    initValue: {},
    getPopupContainer: {
      default: () => {
        return (triggerNode) => {
          return triggerNode.parentNode || document.body
        }
      }
    },
    optionLabelProp: {
      default: 'value'
    },
    titleKey: {
      default: 'value'
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    searchValue: {
      default: 'value'
    },
    placeholder: {},
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const _selected: SelectDropdownMenuData[] = []
    const _innerPlaceholder = ''
    const _visible = false
    const _searchKey = ''
    const _value = ''
    return {
      selected: _selected,
      innerPlaceholder: _innerPlaceholder,
      visible: _visible,
      searchKey: _searchKey,
      value: _value
    }
  },

  mounted() {
    this.innerPlaceholder = this.placeholder
    document.addEventListener('click', this.toggleHandler)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.toggleHandler)
  },

  methods: {
    processMultipleValue(items: SelectDropdownMenuData[]) {
      const str = items
        .map((o) => {
          return String(o[this.optionLabelProp])
        })
        .join('，')
      return str
    },

    findSelected(initValue: (string | number)[]) {
      this.selected = []
      let selected = []
      selected = this.selectOptions.filter((item: SelectDropdownMenuData) => {
        return initValue.indexOf(item.key) !== -1
      })
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
      if (this.disabled) {
        return
      }

      if (!this.visible) {
        this.visible = true
      }
    },

    focus() {
      if (this.disabled) {
        return
      }

      this.openDropdown()

      if (this.value) {
        this.innerPlaceholder = this.value
        this.value = ''
      }

      this.searchKey = ''
    },

    input(e: any) {
      if (this.disabled) {
        return
      }

      const value = e.target.value
      this.value = value
      this.searchKey = value.replace(/^(\s+)|(\s+)$/, '')
    },

    selectItem(selected: SelectDropdownMenuData[]) {
      this.selected = selected
      this.$emit('change', this.selected)
    },

    clearSelected() {
      this.selected = []
      this.$emit('change', this.selected)
    },

    renderDropdownIcon(showClearIcon: boolean) {
      return (
        <u-icon-font type="select-arrow" class={['icon-down', showClearIcon && 'hide-icon-down']} />
      )
    },

    updateValue() {
      this.value = ''

      if (!this.initValue || !this.initValue.length) {
        this.innerPlaceholder = this.placeholder
        this.selected = []
      } else {
        const initValueItems = this.selectOptions.filter((o) => this.initValue.indexOf(o.key) > -1)
        this.value += this.processMultipleValue(initValueItems)
        this.findSelected(this.initValue)
      }
    },

    updateVisible(newVisible: boolean, oldVisible: boolean) {
      if (oldVisible === true && newVisible === false) {
        this.value = ''
        this.value += this.processMultipleValue(this.selected)
      }
    }
  },
  watch: {
    initValue: {
      handler: 'updateValue',
      deep: true,
      immediate: true
    },
    selectOptions: {
      handler: 'updateValue'
    },
    visible: {
      handler: 'updateVisible'
    }
  },

  // eslint-disable-next-line
  render(h: any) {
    let triBoxClass = this.visible
      ? 'mm-filter-tribox show-border focus'
      : 'mm-filter-tribox show-border'

    if (this.disabled) {
      triBoxClass += ' disabled'
    }

    const isAll = this.selected && this.selected.length === 1 && this.selected[0].isAll // 选的全部选项，不应该显示清除图标

    // 选的全部选项，不应该显示清除图标
    const showClearIcon = !!this.selected.length && this.allowClear && !isAll // 显示清除图标

    const slots = {
      overlay: () => (
        <select-dropdown-menu
          ref="dropdownBox"
          data={this.selectOptions}
          mode="multiple"
          filterKey={this.searchKey}
          filterValue={this.searchValue}
          initSelected={this.selected.map((o) => o.key)}
          select={this.selectItem}
          titleKey={this.titleKey || 'value'}
        />
      )
    }
    // 显示清除图标
    return (
      <a-dropdown
        v-slots={slots}
        trigger={['click']}
        visible={this.visible}
        minOverlayWidthMatchTrigger={true}
        getPopupContainer={this.getPopupContainer}
      >
        <div class={triBoxClass} ref="select" title={this.disabled ? this.value : ''}>
          <a-input
            placeholder={this.innerPlaceholder}
            value={this.value}
            title={this.value}
            read-only={this.disabled}
            class="filter-input text-ellipsis"
            on-click={this.openDropdown.bind(this)}
            on-focus={this.focus.bind(this)}
            on-input={this.input.bind(this)}
          />
          {this.renderDropdownIcon(showClearIcon)}
          {showClearIcon && (
            <CloseCircleOutlined class="icon-close" onClick={this.clearSelected.bind(this)} />
          )}
        </div>
      </a-dropdown>
    )
  }
})
