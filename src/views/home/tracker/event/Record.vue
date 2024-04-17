<template lang="pug">
.g-pl-24.g-mt-8.g-pr-24
  .title 测试记录
    .sub-title.g-mt-8
      span 事件: | _pv
      span.g-ml-16 终端: | Android
    UDividerDash.g-mt-4
  .flex-ac.g-mt-16.g-mb-16 验证结果
    a-select.g-ml-16(v-model:value="result" :options="options")&attributes({
      placeholder: '请选择验证结果',
      style: { width: '200px' }
    })
  a-table(size="small" :columns="columns" :data-source="dataSource" :pagination="false")&attributes({ rowKey: 'id' })
    template(#action="{ record }")
      a-popconfirm(@confirm="remove(record)")&attributes({ title: '确定删除吗?' })
        span.text-link 删除
</template>

<script setup lang="ts">
import { ref, markRaw, shallowReactive } from "vue";

const result = ref<number>(null);
const options = markRaw([
  { label: "全部", value: null },
  { label: "验证通过", value: 1 },
  { label: "验证通过", value: 1 },
]);

const columns = markRaw([
  {
    title: "日志获取时间",
    key: "time",
    dataIndex: "time",
    sorter: true,
  },
  {
    title: "日志",
    key: "log",
    dataIndex: "log",
  },
  {
    title: "规则",
    key: "rule",
    dataIndex: "rule",
  },
  {
    title: "验证结果与指标",
    key: "result",
    dataIndex: "result",
  },
  {
    title: "记录来源",
    key: "source",
    dataIndex: "source",
  },
  {
    title: "保存人与保存时间",
    key: "save",
    dataIndex: "save",
    sorter: true,
  },
  {
    title: "操作",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
]);

const dataSource = shallowReactive([{ id: 1 }]);

function remove(record) {}
</script>

<style lang="less" scoped>
.title {
  color: #102048;
  font-weight: bolid;
  .sub-title {
    font-size: 12px;
    color: #7880a0;
  }
}
</style>
