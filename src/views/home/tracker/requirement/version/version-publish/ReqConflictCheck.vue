<template>
  <div>
    <div class="flex-ac">
      <span class="text-main">跨需求检测结果：</span>
      <span>{{ checkResult ? "有冲突" : "无冲突" }}</span>
      <span class="text-main" style="margin-left: 60px">检测时间：</span>
      <span>{{ checkTime || "-" }}</span>
    </div>
    <template v-if="list.length">
      <a-table
        size="middle"
        class="g-mt-16 table-row-align-middle"
        style="word-break: break-word"
        :columns="columns"
        :dataSource="list"
        :pagination="false"
        :rowKey="(record) => record.objId"
      >
      </a-table>
    </template>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ObjectViewDrawer from "../../../object/list/ObjectViewDrawer.vue";
import { TableColumn } from "@/types/table.type";
import { ConflictObj, ConflictTrackerItem } from "@/types/terminalVersion.type";

export default defineComponent({
  name: "ReqConflictCheck",
  components: {},
  props: {
    verisonId: {},
    terminalId: {},
  },
  computed: {
    columns(): TableColumn[] {
      return [
        {
          key: "oid",
          title: "oid",
          dataIndex: "oid",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "padding-left": "24px",
            },
          }),
          customHeaderCell: () => ({
            style: {
              "padding-left": "24px",
            },
          }),
        },
        {
          key: "name",
          title: "对象名称",
          dataIndex: "name",
          customRender: ({ text }: { text: string }) => <span>{text}</span>,
          customCell: () => ({
            style: {
              "min-width": "100px",
              "max-width": "200px",
            },
          }),
        },
        {
          key: "unMergedObjList",
          title: "需求 - 任务",
          dataIndex: "unMergedObjList",
          customRender: ({
            text: trackers,
            record,
          }: {
            text: ConflictTrackerItem[];
            record: ConflictObj;
          }) => {
            return (
              <span>
                {trackers.map((t) => (
                  <div class="flex">
                    <span
                      class="g-mr-16 text-link"
                      onClick={this.onViewObject.bind(
                        this,
                        record.objId,
                        t.historyId
                      )}
                    >
                      查看对象
                    </span>
                    <span class="flex-1 text-ellipsis">
                      {`${t.requirementName} - ${t.taskName}`}
                    </span>
                  </div>
                ))}
              </span>
            );
          },
        },
        {
          key: "mergeResult",
          title: "合并结果",
          dataIndex: "mergeResult",
          customRender: ({ text: mergeResult }: { text: boolean }) => (
            <span>{mergeResult ? "已合并" : "未合并"}</span>
          ),
        },
      ];
    },
  },

  data() {
    const _checkTime = "";
    const _checkResult = false;
    const _list: ConflictObj[] = [];

    return {
      checkTime: _checkTime,
      checkResult: _checkResult,
      list: _list,
    };
  },
  methods: {
    // 查看对象
    onViewObject(objId: number, historyId: number) {
      this.$createInstance(ObjectViewDrawer, { id: objId, historyId });
    },
  },
});
</script>
