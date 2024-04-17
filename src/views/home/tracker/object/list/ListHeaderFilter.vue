<template>
  <a-dropdown :trigger="['click']" v-model:visible="visible">
    <a-tooltip placement="left" v-if="title">
      <template #title>
        <span>{{ title }}</span>
      </template>
      <u-icon-button class="c-icon__setting" iconFont="setting"></u-icon-button>
    </a-tooltip>
    <u-icon-button
      class="c-icon__setting"
      iconFont="setting"
      v-else
    ></u-icon-button>
    <template #overlay
      ><div
        style="
          background: #fff;
          width: 160px;
          box-shadow: 0px 0px 4px rgba(164, 164, 164, 0.25);
          border-radius: 2px;
        "
      >
        <div style="border-bottom: 1px solid #e2e7f0; padding: 10px">
          列配置
        </div>
        <a-checkbox-group
          :options="options"
          class="header-checkbox-group"
          :defaultValue="['name', 'oid', 'type']"
          :value="value"
          @change="onChange"
        ></a-checkbox-group>
        <div style="border-top: 1px solid #e2e7f0; padding: 10px 10px">
          <u-text-button :on-click="onOK">确定</u-text-button>
        </div>
      </div></template
    >
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ListHeaderFilter",
  props: {
    options: {
      default: () => [
        {
          label: "对象oid(名称)",
          value: "oid",
          disabled: true,
        },
        {
          label: "对象类型",
          value: "type",
          disabled: true,
        },
        {
          label: "埋点需求",
          value: "tracker",
        },
        {
          label: "创建人",
          value: "creator",
        },
        {
          label: "创建时间",
          value: "createTime",
        },
        {
          label: "最近修改人",
          value: "updater",
        },
        {
          label: "最近修改时间",
          value: "updateTime",
        },
      ],
      required: false,
      type: Array,
    },
    title: {
      default: "",
      required: false,
      type: String,
    },
    localKey: {
      default: "easy-insight-obj-table-colKeys",
      required: false,
      type: String,
    },
    selectAll: {
      default: false,
    },
  },
  data() {
    const _visible = false;
    const _value: any = [];

    return { visible: _visible, value: _value };
  },
  created() {
    const v = localStorage.getItem(this.localKey);

    this.value = v ? JSON.parse(v) : this.options.map((v) => v.value);
    this.$attrs["on-change"](this.value);
  },

  methods: {
    onChange(v) {
      this.value = v;
    },
    onOK() {
      localStorage.setItem(this.localKey, JSON.stringify(this.value));
      this.$attrs["on-change"](this.value);
      this.visible = false;
    },
  },
});
</script>

<style lang="less" scoped="true">
.header-checkbox-group {
  padding: 10px;
  :deep(.ant-checkbox-group-item + .ant-checkbox-group-item) {
    margin-top: 8px;
  }
  :deep(.c-icon__setting) {
    font-size: 30px;
  }
}
</style>
