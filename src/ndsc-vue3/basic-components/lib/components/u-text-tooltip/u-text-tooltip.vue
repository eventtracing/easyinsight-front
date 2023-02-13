<template>
  <a-tooltip
    :visible="visible"
    overlayClassName="u-text-tooltip"
    placement="bottomLeft"
    :getPopupContainer="getPopupContainer"
    :destroyTooltipOnHide="true"
    :align="align"
    @visibleChange="handleVisibleChange"
  >
    <template slot="title">
      <div>{{ content }}</div>
    </template>
    <span
      ref="text"
      style="display: block; width: 100%"
      @mouseenter="handleMouseEnter"
      :style="`--count: ${maxLineCount}`"
      :class="className"
    >
      <slot>{{ text }}</slot>
    </span>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Tooltip } from "ant-design-vue";
export default defineComponent({
  name: "u-text-tooltip",
  components: {
    "a-tooltip": Tooltip,
  },
  props: {
    text: {},
    maxLineCount: {
      type: Number,
      default: 1,
    },
    getPopupContainer: {
      default: () => () => document.body,
    },
    alignWithMouse: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    content() {
      return this.text || this.$slots.default[0]?.text;
    },

    align() {
      const offset = [this.mouseOffsetX, -4];

      return {
        offset: this.alignWithMouse ? offset : [0, -4],
      };
    },

    className() {
      return this.maxLineCount > 1
        ? "u-text-ellipsis-multiline"
        : "u-text-ellipsis";
    },

    textEle() {
      return this.$refs.text;
    },
  },

  data() {
    return {
      visible: false,
      tooltipShow: false,
      mouseOffsetX: 0,
    };
  },

  mounted() {
    this.getTooltipShow();
  },

  methods: {
    getTooltipShow() {
      if (!this.textEle) return;

      const element = this.textEle;
      const offsetWidth = element.offsetWidth;
      const offsetHeight = element.offsetHeight;
      const scrollWidth = element.scrollWidth;
      const scrollHeight = element.scrollHeight;

      this.tooltipShow =
        scrollWidth > offsetWidth || scrollHeight > offsetHeight;
    },
    handleVisibleChange(visible: boolean) {
      this.visible = this.tooltipShow ? visible : false;
    },
    handleMouseEnter(e: MouseEvent) {
      this.mouseOffsetX = e.offsetX;
    },
    onTextChange() {
      this.$nextTick(() => {
        this.getTooltipShow();
      });
    },
  },
  watch: {
    text: {
      handler: "onTextChange",
    },
  },
});
</script>
