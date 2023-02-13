<template>
  <MultiSelect
    v-bind="$attrs"
    :initValue="value"
    :selectOptions="selectOptions"
    :placeholder="placeholder"
    @changeSelect="onChange"
  ></MultiSelect>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MultiSelect from './m-filter-select/MultiSelect'
export default defineComponent({
  name: 'u-mutiple-select',
  components: {
    MultiSelect
  },
  props: {
    value: {},
    placeholder: {
      default: '请选择'
    },
    options: {},
    labelAttr: {
      default: 'key'
    },
    valueAttr: {
      default: 'value'
    }
  },
  computed: {
    selectOptions() {
      const options: any[] = (this.options || []).map((o) => {
        return {
          key: o[this.labelAttr],
          value: o[this.valueAttr]
        }
      })
      return options
    }
  },
  methods: {
    onChange(option: { key: string; value: string }) {
      this.$emit('change', option?.key)
    }
  }
})
</script>
