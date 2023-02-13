<template>
  <span>
    <a-popover
      :visible="visible"
      trigger="click"
      placement="bottomLeft"
      @visibleChange="handleClickChange"
      :arrowPointAtCenter="true"
    >
      <template #title>
        <div style="margin: 10px; ofnt-size: 16px">列配置</div>
      </template>
      <template #content
        ><div>
          <a-checkbox-group @change="handleColumnChange" :value="value">
            <div
              v-for="column in columns"
              :key="column.key"
              style="padding: 10px"
            >
              <a-checkbox :value="column.key">{{ column.title }}</a-checkbox>
            </div>
          </a-checkbox-group>
          <div style="padding-top: 10px">
            <a-button
              style="margin-right: 5px"
              size="small"
              type="primary"
              @click="handleOk"
              >确认</a-button
            >
            <a-button size="small" @click="handleCancel">取消</a-button>
          </div>
        </div></template
      >
      <SettingOutlined
        style="margin-left: 10px; font-size: 18px; cursor: pointer"
      />
    </a-popover>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SettingOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "column-setting",
  components: {
    SettingOutlined,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    const _visible = false;
    return {
      visible: _visible,
    };
  },

  methods: {
    handleClickChange(visible) {
      this.visible = visible;
      this.$emit("visibleChange", visible);
    },

    handleColumnChange(value) {
      this.$emit("columnChange", value);
    },

    handleOk() {
      this.$emit("handleOk");
      this.visible = false;
    },

    handleCancel() {
      this.visible = false;
    },
  },
});
</script>

<style lang="less" scoped="true">
.device-detail-item {
  margin-bottom: 10px;
}
.red {
  color: red;
}
</style>
