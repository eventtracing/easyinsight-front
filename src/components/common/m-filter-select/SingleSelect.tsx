import { defineComponent } from 'vue'
import { Input, Dropdown } from 'ant-design-vue'
import SelectDropdownMenu from './menu/VirtualMenu.vue'
import { SelectDropdownMenuData } from './menu/type'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import './select.less'

export default defineComponent({
  name: 'm-single-select',
  components: {
    CloseCircleOutlined,
    'a-input': Input,
    'a-dropdown': Dropdown,
    'select-dropdown-menu': SelectDropdownMenu
  },
  props: {
    options: {},
    initValue: {},
    getPopupContainer: {
      default: () => {
        return (triggerNode) => {
          return triggerNode.parentNode || document.body
        }
      }
    },
    allowClear: {
      type: Boolean,
      default: false
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
    const _selected: SelectDropdownMenuData = null
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

    closeDropDown() {
      this.visible = false
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
      this.selected = selected[0]
      this.$emit('changeSelect', this.selected)
      this.closeDropDown()
    },

    clearSelected() {
      this.selected = null
      this.$emit('change', this.selected)
      this.closeDropDown()
    },

    renderDropdownIcon(showClearIcon: boolean) {
      return (
        <u-icon-font type="select-arrow" class={['icon-down', showClearIcon && 'hide-icon-down']} />
      )
    },

    updateValue() {
      this.value = ''

      if (!this.initValue) {
        this.selected = null
        this.innerPlaceholder = this.placeholder
      } else {
        const item = this.options.find((o) => this.initValue === o.key)
        this.value += item?.value || this.initValue
        this.selected = item
      }
    },

    updateVisible(newVisible: boolean, oldVisible: boolean) {
      if (oldVisible === true && newVisible === false) {
        this.value = this.selected?.value
      }
    }
  },
  watch: {
    initValue: {
      handler: 'updateValue',
      deep: true,
      immediate: true
    },
    options: {
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

    const slot = {
      overlay: () => {
        return (
          <select-dropdown-menu
            ref="dropdownBox"
            data={this.options}
            modes="single"
            filterKey={this.searchKey}
            filterValue={this.searchValue}
            initSelected={initSelected}
            select={this.selectItem}
            titleKey="value"
          />
        )
      }
    }

    const showClearIcon = !!this.selected && this.allowClear // 显示清除图标

    // 显示清除图标
    const initSelected = this.selected ? [this.selected.key] : []
    return (
      <a-dropdown
        v-slots={slot}
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
            onClick={this.openDropdown.bind(this)}
            onFocus={this.focus.bind(this)}
            onInput={this.input.bind(this)}
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
