<template>
  <a-tooltip
    :overlayStyle="{ maxWidth: '300px' }"
    :placement="tooltipPlacement"
    :align="align"
  >
    <template #title>
      <slot name="title">
        <div v-html="title"></div>
      </slot>
    </template>
    <QuestionCircleOutlined
      v-if="iconPosition === 'left'"
      style="margin-right: 4px; color: #666"
    />
    <span ref="text"
      ><slot>{{ text }}</slot></span
    >
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Tooltip } from "ant-design-vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "UHintTooltip",
  components: {
    QuestionCircleOutlined,
    "a-tooltip": Tooltip,
  },
  props: {
    text: {},
    title: {},
    placement: {
      default: "top",
      validator: (value: string) => {
        return ["top", "bottom"].indexOf(value) !== -1;
      },
    },
    iconPosition: {
      default: "right",
      validator: (value: string) => {
        return ["left", "right"].indexOf(value) !== -1;
      },
    },
  },
  computed: {
    tooltipPlacement() {
      return this.placement === "top" ? "topLeft" : "bottomLeft";
    },

    align() {
      const offset =
        this.iconPosition === "right" ? [this.textWidth - 9, 0] : [-13, 0];

      return { offset };
    },

    textEle() {
      return this.$refs.text;
    },
  },

  data() {
    return {
      textWidth: 0,
    };
  },

  mounted() {
    this.textWidth = this.textEle ? this.textEle.offsetWidth : 0;
  },
});
</script>
