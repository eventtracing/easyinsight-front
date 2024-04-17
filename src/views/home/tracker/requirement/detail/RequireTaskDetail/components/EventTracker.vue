<template>
  <div>
    <a-form-item label="事件与事件公参" name="param">
      <a-select
        :disabled="disabled"
        class="g-mb-8"
        placeholder="请选择事件与事件公参"
        v-model:value="formState.eventId"
        :options="eventLists"
        @change="getVersionLists"
      ></a-select>
      <a-select
        :disabled="!isEdit && disabled"
        class="g-mb-8"
        style="width: 200px"
        placeholder="请选择公参包"
        v-model:value="formState.version"
        :options="versionLists"
        @change="changeVersion($event, formState.eventId)"
      ></a-select>
      <a-table
        rowKey="code"
        size="small"
        :pagination="false"
        :columns="columns"
        :data-source="dataSource"
      />
    </a-form-item>
    <UDividerDash class="g-mt-16 g-mb-16" />
    <a-form-item label="终端与全局公参" name="global">
      <TerminalConfigItem
        :disabled="disabled"
        :terminals="terminals"
        :item="formState"
        :isDetail="isEdit"
        :fromReqEventStatus="isEdit"
        :formState="formState"
        ref="terminalRef"
        class="c-terminal__item"
      />
    </a-form-item>
  </div>
</template>

<script lang="tsx" setup>
import TerminalConfigItem from "@/views/home/tracker/object/list/TerminalConfigItem.vue";
import { getEventList, getReqEventDetail } from "@/services/event.service";
import {
  getVersionList,
  getVersionParamDetail,
} from "@/services/version.service";
import { ParamValueTypeEnum } from "@/types/parameter.type";
import { getTerminalList } from "@/services/terminal.service";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    eventBuryPointId: number;
    isEdit: boolean;
    formState: Record<string, any>;
  }>(),
  {
    formState: () => ({ param: 1 }),
    isEdit: false,
    disabled: false,
  }
);

const { disabled, isEdit } = props;
const formState = toRef(props, "formState");

const columns = markRaw([
  {
    key: "code",
    dataIndex: "code",
    title: "参数名",
  },
  {
    key: "name",
    dataIndex: "name",
    title: "中文名称",
  },
  {
    key: "valueType",
    dataIndex: "valueType",
    title: "取值类型",
    customRender: ({ text: valueType }: { text: ParamValueTypeEnum }) => {
      return (
        <span>
          {valueType === ParamValueTypeEnum.CONSTANT ? "常量" : "变量"}
        </span>
      );
    },
  },
  {
    key: "values",
    dataIndex: "values",
    title: "取值",
    customRender: ({ text }: { text: any[] }) => {
      return <span>{text.map((v) => v.code).join(",")}</span>;
    },
  },
  {
    key: "description",
    dataIndex: "description",
    title: "取值描述",
  },
  {
    key: "notEmpty",
    dataIndex: "notEmpty",
    title: "非空",
    customRender: ({ text: notEmpty }: { text: boolean }) => {
      return <a-checkbox disabled checked={notEmpty}></a-checkbox>;
    },
  },
  {
    key: "must",
    dataIndex: "must",
    title: "必传",
    customRender: ({ text }: { text: boolean }) => {
      return <a-checkbox disabled checked={text}></a-checkbox>;
    },
  },
]);

const dataSource = shallowReactive([]);
const eventLists = shallowReactive([]);
const versionLists = shallowReactive([]); // 公参包
const terminals = shallowReactive([]);
const terminalRef = ref();
watch(
  () => formState.value.eventId,
  (eventId) => {
    getVersionLists(eventId);
  }
);

function getVersionLists(eventId) {
  const event = eventLists.find((v) => v.key === eventId);
  formState.value.version = undefined;
  dataSource.length = 0;

  if (!eventId) return;

  getVersionList({ entityId: eventId, entityType: 2 }).then((res: any) => {
    versionLists.length = 0;

    versionLists.push(...res.map((v) => ({ label: v.name, value: v.id })));

    if (versionLists.length) {
      formState.value.version =
        formState.value.returnVersion || versionLists[0]?.value;
      changeVersion(formState.value.version, eventId);
    }
  });
}

function changeVersion(version, eventId) {
  const params = { entityId: eventId, entityType: 2, versionId: version };

  getVersionParamDetail(params).then((res) => {
    dataSource.length = 0;
    dataSource.push(...res);
  });
}

onMounted(() => {
  const search = { currentPage: 1, search: "" };

  getEventList({ ...search, pageSize: 80 }).then((res) => {
    eventLists.length = 0;
    eventLists.push(
      ...res.list.map((v) => ({
        label: `${v.code}(${v.name})`,
        value: v.id,
        key: v.id,
      }))
    );
  });

  getTerminalList({ ...search, pageSize: 50 }).then((res) => {
    terminals.length = 0;
    terminals.push(...res.list);
  });

  if (isEdit) {
    getReqEventDetail(props.eventBuryPointId).then((res) => {
      Object.assign(formState.value, res);
      formState.value.returnVersion = res.eventParamPackageId;
    });
  }
});

defineExpose({});
</script>

<style scoped lang="less">
.c-terminal__item {
  justify-content: flex-start;
}
</style>
