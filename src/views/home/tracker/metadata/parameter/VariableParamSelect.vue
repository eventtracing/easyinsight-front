<template>
  <a-auto-complete
    :options="variableOptions.map((v) => ({ value: v[param] }))"
    v-model:value="selectValue"
    @select="emitterRule"
    placeholder="请输入信息"
  ></a-auto-complete>
</template>

<script lang="ts">
import { defineComponent } from "vue";
enum keyMap {
  rule = "name",
  name = "rule",
}
enum reqMap {
  // 请求参数转换
  rule = "name",
  name = "code",
}
export default defineComponent({
  name: "VariableParamSelect",
  setup() {
    const _defaultValue: string | number = "";

    return { defaultValue: _defaultValue };
  },
  props: {
    id: {
      default: "",
      required: false,
      type: [String, Number],
    },
    uuid: {
      default: "",
      required: false,
      type: [String, Number],
    },
    initialValue: {
      default: "",
      required: false,
      type: [String, Number],
    },
    param: {
      default: "id",
      required: false,
      type: String,
    },
    variableOptions: {
      default: () => [],
      required: false,
      type: Array,
    },
    eventEmitter: {
      default: () => {},
      required: false,
      type: Object,
    },
  },
  data() {
    const _variable = "";
    const _selectValue = "";

    return {
      variable: _variable,
      selectValue: _selectValue,
    };
  },
  beforeUnmount() {
    this.eventEmitter.off(`${this.param}-${this.uuid}`, this.autoSelectValue);
  },
  methods: {
    autoSelectValue(value) {
      const otherParam = keyMap[this.param];
      const currentValue = this.variableOptions.find(
        (v) => v[otherParam] === value
      );

      currentValue && (this.selectValue = currentValue[this.param]);
    },

    emitterRule(n = this.selectValue) {
      this.eventEmitter.emit(`${keyMap[this.param]}-${this.uuid}`, n);
    },

    change(n) {
      this.$attrs["on-changeSelect"](reqMap[keyMap[this.param]], n);
    },

    changeDefaultValue(n) {
      this.selectValue = n;
      this.$nextTick(() => {
        this.eventEmitter.on(
          `${this.param}-${this.uuid}`,
          this.autoSelectValue
        );
      });
    },
  },
  watch: {
    selectValue: { handler: "change" },
    initialValue: { handler: "changeDefaultValue", immediate: true },
  },
});
</script>

<style scoped="true">
.m-vaiable__params {
  width: 200px !important;
}
.m-dropdownRender {
  padding: 0 10px;
  margin-bottom: 10px;
}
</style>
