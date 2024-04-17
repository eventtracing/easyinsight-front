<template>
  <u-drawer
    :title="title"
    :width="1000"
    :visible="true"
    :footer="true"
    @handlerClose="handleClose"
  >
    <a-steps :current="currentStep" size="small" class="g-mb-24">
      <a-step title="冲突列表"></a-step>
      <a-step title="对象diff"></a-step>
      <a-step title="对象变基"></a-step>
    </a-steps>
    <template v-if="currentStep === 0">
      <div>
        <span
          >基准版本已变更，当前最新端版本为：{{
            newestTerminalVersionName
          }}</span
        >
        <span v-if="taskRelObjId" style="margin-left: 40px"
          >所属任务：{{ taskName }}</span
        >
      </div>
      <div class="g-mt-16">检测到以下冲突对象，请查看并确认：</div>
      <a-table
        size="middle"
        class="g-mt-16 table-row-align-middle"
        style="word-break: break-word"
        :columns="columns"
        :dataSource="conflictObjs"
        :pagination="false"
        :rowKey="(record) => record.objId"
      >
      </a-table>
    </template>
    <ObjectDiffDetail
      v-if="currentStep === 1"
      :objId="objId"
      :historyId="historyId"
      :trackerId="trackerId"
      :terminalId="terminalId"
      :baseTerminalVersionId="baseTerminalVersionId"
      :newestTerminalVersionId="newestTerminalVersionId"
    ></ObjectDiffDetail>
    <template #footer="">
      <template v-if="currentStep === 0">
        <a-button @click="handleClose">取消</a-button>
      </template>
      <template v-else-if="currentStep === 1">
        <a-button @click="onPrev">上一步</a-button>
      </template>
    </template>
  </u-drawer>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ObjectDiffDetail from "../components/object-diff/ObjectDiffDetail.vue";
import { TableColumn } from "@/types/table.type";
import { ObjTypeEnum } from "@/types/object.type";
import { ReqObjectTypeEnum } from "@/types/requirement.type";
import { DiffBaseConflictObjVO } from "@/types/terminalVersion.type";

export default defineComponent({
  name: "ObjectDiffDrawer",
  components: {
    ObjectDiffDetail,
  },
  props: {
    terminalId: {},
    taskId: {},
    taskRelObjId: {},
    taskName: {},
    objName: {},
    operateText: {},
  },
  computed: {
    title() {
      return this.taskRelObjId
        ? `冲突确认（对象：${this.objName}）`
        : `冲突确认（任务：${this.taskName}）`;
    },
    columns(): TableColumn[] {
      return [
        {
          key: "oid",
          title: "oid",
          dataIndex: "oid",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
          customCell: () => {
            return {
              style: {
                "padding-left": "24px",
              },
            };
          },
          customHeaderCell: () => {
            return {
              style: {
                "padding-left": "24px",
              },
            };
          },
        },
        {
          key: "name",
          title: "对象名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
          customCell: () => {
            return {
              style: {
                "min-width": "100px",
                "max-width": "200px",
              },
            };
          },
        },
        {
          key: "type",
          title: "对象类型",
          dataIndex: "type",
          customRender: ({ text: type }: { text: ObjTypeEnum }) => {
            const text = type === ObjTypeEnum.PAGE ? "页面" : "元素";
            return <span>{text}</span>;
          },
        },
        {
          key: "reqType",
          title: "需求类型",
          dataIndex: "reqType",
          customRender: ({ text: type }: { text: ReqObjectTypeEnum }) => {
            const text = type === ReqObjectTypeEnum.CHANGE ? "变更" : "新建";
            return <span>{text}</span>;
          },
        },
        {
          key: "baseTerminalVersionName",
          title: "原基准版本",
          dataIndex: "baseTerminalVersionName",
          customRender: ({ text }: { text: string }) => {
            return <span>{text}</span>;
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 80,
          customRender: ({ record }: { record: DiffBaseConflictObjVO }) => {
            return (
              <u-text-button on-click={this.onRebase.bind(this, record)}>
                对象变基
              </u-text-button>
            );
          },
        },
      ];
    },
  },
  data() {
    const _currentStep = 0;
    const _newestTerminalVersionId: number = null;
    const _newestTerminalVersionName = "";
    const _conflictObjs: DiffBaseConflictObjVO[] = [];
    const _objId: number = null;
    const _historyId: number = null;
    const _trackerId: number = null;
    const _baseTerminalVersionId: number = null;

    // 旧base端版本id
    return {
      currentStep: _currentStep,
      newestTerminalVersionId: _newestTerminalVersionId,
      newestTerminalVersionName: _newestTerminalVersionName,
      conflictObjs: _conflictObjs,
      objId: _objId,
      historyId: _historyId,
      trackerId: _trackerId,
      baseTerminalVersionId: _baseTerminalVersionId,
    };
  },
  methods: {
    onRebase(record: DiffBaseConflictObjVO) {
      this.objId = record.objId;
      this.historyId = record.historyId;
      this.trackerId = record.trackerId;
      this.baseTerminalVersionId = record.baseTerminalVersionId;
      this.onNext();
    },
    onNext() {
      this.currentStep++;
    },
    onPrev() {
      this.currentStep--;
    },
    handleClose() {
      this.$emit("close");
    },
  },
});
</script>
