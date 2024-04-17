<template>
  <FilterSelect
    style="line-height: 32px"
    v-bind="$attrs"
    :initValue="value"
    :mode="mode"
    :selectOptions="selectOptions"
    :alwaysShowDropdownIcon="alwaysShowDropdownIcon"
    :maxTagTextLength="20"
    @changeSelect="onChange"
  ></FilterSelect>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FilterSelect from './m-filter-select/FilterSelect'
export default defineComponent({
  name: 'u-filter-select',
  components: {
    FilterSelect
  },
  props: {
    value: {},
    options: {},
    mode: {
      default: 'single'
    },
    labelAttr: {
      default: 'key'
    },
    valueAttr: {
      default: 'value'
    },
    hasAll: {
      type: Boolean,
      default: true
    },
    ignoreNull: {
      type: Boolean,
      default: false
    },
    alwaysShowDropdownIcon: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    selectOptions() {
      let options: any[] = (this.options || []).map((o) => {
        return {
          key: o[this.valueAttr],
          value: o[this.labelAttr]
        }
      })

      if (this.hasAll) {
        options = [
          {
            key: 'all',
            isAll: true,
            value: '全部'
          },
          {
            key: 'divider',
            divider: true
          }
        ].concat(options)
      }

      return options
    }
  },
  methods: {
    onChange(
      selectedOptions: {
        key: string
        value: string
      }[]
    ) {
      const selected = selectedOptions.map((o) => o.key)
      if (this.mode === 'single') {
        const v = this.hasAll && selected[0] === undefined ? 'all' : selected[0]
        this.$emit('change', v, selectedOptions[0])
      } else {
        this.$emit('change', selected)
      }
    }
  }
})
</script>
