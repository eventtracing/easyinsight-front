<template>
  <div class="u-info-item" :style="{ 'align-items': $_itemsAlign }" :class="classes">
    <span :style="labelStyle" class="label">
      <slot name="label">{{ label }}</slot>
    </span>
    <span class="value"><slot></slot></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'u-info-item',
  props: {
    label: {
      type: String
    },
    labelWidth: {
      type: Number
    },
    required: {
      type: Boolean,
      default: false
    },
    labelAlign: {
      type: String,
      validator: (value: string) => {
        return ['left', 'right'].indexOf(value) !== -1
      }
    },
    itemsAlign: {
      type: String,
      validator: (value: string) => {
        return ['flex-start', 'center', 'flex-end'].indexOf(value) !== -1
      }
    },
    size: {
      type: String,
      validator: (value: string) => {
        return ['small', 'default', 'large'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    labelStyle() {
      return this.$_labelWidth
        ? {
            width: `${this.$_labelWidth}px`,
            textAlign: this.$_labelAlign
          }
        : {
            textAlign: this.$_labelAlign
          }
    },

    classes() {
      return this.required ? [this.$_size, 'required'] : [this.$_size]
    }
  },

  data() {
    const _$_labelWidth = null
    const _$_labelAlign = null
    const _$_itemsAlign = null
    const _$_size = null
    return {
      $_labelWidth: _$_labelWidth,
      $_labelAlign: _$_labelAlign,
      $_itemsAlign: _$_itemsAlign,
      $_size: _$_size
    }
  },

  created() {
    if (this.$parent?.$options?.name === 'u-info') {
      const { labelWidth, labelAlign, itemsAlign, size } = this.$parent.$props
      this.$_labelWidth = this.labelWidth || labelWidth
      this.$_labelAlign = this.labelAlign || labelAlign || 'left'
      this.$_itemsAlign = this.itemsAlign || itemsAlign || 'flex-start'
      this.$_size = this.size || size || 'default'
    } else {
      this.$_labelWidth = this.labelWidth || 0
      this.$_labelAlign = this.labelAlign || 'left'
      this.$_itemsAlign = this.itemsAlign || 'center'
      this.$_size = this.size || 'default'
    }
  }
})
</script>

<style lang="less" scoped="true">
.u-info-item {
  display: inline-flex;

  .label {
    display: inline-block;
    color: #102048;
    margin-right: 16px;
  }

  &.required {
    .label::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  .value {
    word-break: break-all;
  }

  &.large + .u-info-item {
    margin-top: 16px;
  }

  &.default {
    width: 50%;
    .value {
      flex: 1;
      min-width: 0;
    }
  }

  &.large {
    display: flex;
    .value {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
