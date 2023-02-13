<template>
  <div>
    <a-collapse :bordered="false">
      <a-collapse-panel :key="sample.event_code" v-for="sample in sampleData">
        <template #header>
          <div class="flex-ac c-data__header">
            {{ sample.event_code }}({{ sample.event_name }})
            <icon-font
              title="复制"
              class="icon-copy"
              type="icon-fuzhi"
              v-if="sample.data"
              @click.stop="copyJSON(sample.data)"
            ></icon-font>
          </div>
        </template>
        <div class="fill c-json__container" v-if="sample.data">
          <json-viewer :expandDepth="Infinity" :value="sample.data" />
        </div>
        <div class="flex-c g-mt-8" v-else>暂无数据～</div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, watchEffect, shallowRef } from "vue";
import { getObjectRecordData } from "@/services/object.service";
import { message } from "ant-design-vue";
import { getExampleData } from "@/services/event.service";

type ConditionKeyDto = {
  terminalId: number;
  releaseId: number | string;
};

// @ts-ignore
const props = withDefaults(
  defineProps<{
    id: number;
    conditions?: ConditionKeyDto;
    from?: string;
  }>(),
  {
    conditions: () => ({
      terminalId: null,
      releaseId: null,
    }),
    id: null,
  }
);

const isFromEvent = props.from === "event"; // 事件样例数据
const sampleData = shallowRef<any>({});

watchEffect(() => {
  const conditions = props.conditions;
  const handler = (res) => {
    (res || []).forEach(({ data }) => {
      transformJsonData(data);
    });

    sampleData.value = res;
  };

  if (isFromEvent) {
    getExampleData({ eventBuryPointId: props.id }).then(handler);
  } else if (conditions) {
    getObjectRecordData({ objId: props.id, ...conditions }).then(handler);
  }
});

function transformJsonData(data) {
  Object.keys(data).forEach((key) => {
    const value = data[key];

    data[key] = Array.isArray(value)
      ? value.map((v) => transformJsonData(v))
      : transformKeyValue(value);
  });

  return data;
}

function transformKeyValue(data) {
  const { value, comment } = data;

  return `${value}${comment ? "// " + comment : ""}`;
}

function copyJSON(tracker) {
  const input = document.createElement("input");

  document.body.appendChild(input);

  input.setAttribute("value", JSON.stringify(tracker));
  input.select();

  if (document.execCommand("copy")) {
    document.execCommand("copy");
    message.success("复制成功~");
  } else {
    message.error("复制失败~");
  }

  document.body.removeChild(input);
}
</script>

<style scoped lang="less">
:deep(.ant-collapse-content-box) {
  background: #fff;
}
:deep(.jv-container.jv-light .jv-key) {
  color: red;
}
.c-data__header {
  justify-content: space-between;
}
.c-json__container {
  overflow-y: auto;
  max-height: 60vh;
}
</style>
