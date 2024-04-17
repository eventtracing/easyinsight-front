<template>
  <div class="flex-c">
    <a-tooltip
      v-if="title"
      :placement="placement"
      overlayClassName="u-icon-button-tooltip"
      :align="align"
    >
      <template #title>
        <span>{{ title }}</span>
      </template>
      <slot v-if="icon" name="icon"></slot>
      <IconFont
        v-else
        :type="iconFont"
        :prefix="iconFontPrefix"
        :class="classNames"
        :disabled="disabled"
      />
    </a-tooltip>
    <div v-else-if="icon">
      <slot name="icon"></slot>
    </div>
    <IconFont
      v-else
      :type="iconFont"
      :prefix="iconFontPrefix"
      :class="classNames"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Tooltip } from "ant-design-vue";
import IconFont from "../u-icon-font";
export default defineComponent({
  name: "u-icon-button",
  components: {
    "a-tooltip": Tooltip,
    IconFont,
  },
  props: {
    icon: {},
    iconFont: {},
    iconFontPrefix: {
      default: "icon-",
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    title: {},
    placement: {
      default: "bottom",
    },
  },
  computed: {
    align() {
      const offset =
        this.placement === "bottom" && !this.disabled ? [0, 8] : [0, 0];

      return { offset };
    },

    classNames() {
      return this.disabled ? "u-icon-button__disabled" : "u-icon-button";
    },
  },
  methods: {
    click() {
      !this.disabled && this.$emit("click");
    },
  },
});
</script>
