<template>
  <SingleSelect
    v-bind="$attrs"
    :initValue="value"
    :options="selectOptions"
    :placeholder="placeholder"
    @changeSelect="onChange"
  ></SingleSelect>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SingleSelect from './m-filter-select/SingleSelect'
export default defineComponent({
  name: 'u-single-select',
  components: {
    SingleSelect
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
