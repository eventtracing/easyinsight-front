<template>
  <div>
    <a-table
      size="small"
      style="word-break: break-word"
      :columns="columns()"
      :dataSource="list"
      :scroll="scroll"
      :pagination="false"
      :rowSelection="rowSelection"
      :rowKey="getRowKey"
      :expandedRowKeys="expandKeys"
      :rowClassName="rowClassName"
      @change="changeTable"
      @expand="expand"
    >
    </a-table>
  </div>
</template>

<script lang="tsx">
import { defineComponent, h } from "vue";
import StatusTag from "../components/StatusTag.vue";
import ObjectEditDrawer from "../../object/list/ObjectEditDrawer.vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { TablePagination, TableColumn } from "@/types/table.type";
import { Checkbox } from "ant-design-vue";
import {
  TaskRelObjDto,
  taskOperateTextMap,
  ReqStatusEnum,
  TaskRelObjectTypeEnum,
  ReqObjectTypeEnum,
} from "@/types/requirement.type";
import Bus from "@/bus";
import store from "@/store";
import { getSpm } from "@/services/object.service";
import { backTaskData, forwardTaskData } from "@/services/requirement.service";

const AuthCodeMap = new Map([
  [ReqStatusEnum.START, 1005],
  [ReqStatusEnum.WAIT_VRFY, 1006],
  [ReqStatusEnum.VRFY_FINISHED, 1007],
  [ReqStatusEnum.DEV_FINISHED, 1008],
]);

const objectType = store.state.objectType;

const genBackground = (level: number) => {
  if (level > 0) {
    let background = "linear-gradient(to right, #dee2e6 0%, #dee2e6 16px,";
    let color = "#fff";
    let stop: any = 16;

    for (let i = 0; i < level; i++) {
      background += ` ${color} ${stop}px,`;

      if (i === level - 1) {
        background += ` ${color} 100%`;
      } else {
        stop += 16;
        background += ` ${color} ${stop}px,`;
      }

      color = color === "#f6f7fa" ? "#fff" : "#f6f7fa";
    }

    background += ")";

    return background;
  }

  return "#fff;";
};

export default defineComponent({
  name: "ExpandObjTable",
  components: { StatusTag, Checkbox },
  mixins: [TableMixin],
  props: {
    hasNoEditAuth: {},
    list: {},
    terminalId: {},
    taskName: {},
    selectedRowKeys: {},
    requireId: {},
    displayType: {},
    record: {},
    taskId: null,
    hasSearch: {},
  },
  computed: {
    scroll() {
      return {
        x: "max-content",
      };
    },

    rowSelection() {
      return {
        columnWidth: 48,
        selectedRowKeys: this.selectedRowKeys,
        getCheckboxProps(record) {
          return {
            disabled: !record.id || record.status === 6 || record.mergeConflict,
          };
        },
        onSelect: (record, select) => {
          const selectKeys = this.selectedRowKeys;
          const id = record.id;

          if (select) {
            if (id) {
              const data = this.flatList.filter(
                (v: any) => record.refId === v.refId
              );
              const hadTaskIdData = data.map((item) => ({
                ...item,
                taskId: this.taskId,
              }));

              selectKeys.push(...data.map((v: any) => v.refId));
              this.selectObjects.push(...hadTaskIdData);
            } else {
              this.$message.error("该对象不存在对应的任务上～");
            }
          } else {
            const index = selectKeys.indexOf(record.refId);

            if (~index) {
              const data = this.flatList.filter(
                (v: any) => record.refId === v.refId
              );
              const hadTaskIdData = data.map((item) => ({
                ...item,
                taskId: this.taskId,
              }));
              hadTaskIdData.forEach(() => {
                const i = selectKeys.indexOf(record.refId);
                selectKeys.splice(i, 1);
                this.selectObjects.splice(index, 1);
              });
            }
          }

          this.$emit("select", selectKeys, this.selectObjects);
        },
        onSelectAll: (selected, records) => {
          const selectKeys = this.selectedRowKeys;

          if (selected) {
            const obj = {};
            records = records.filter((v) => v.id);
            records.forEach((r) => {
              if (!obj[r.id]) {
                obj[r.id] = true;
                const data = this.flatList.filter(
                  (v: any) => r.refId === v.refId
                );
                const hadTaskIdData = data.map((item) => ({
                  ...item,
                  taskId: this.taskId,
                }));
                selectKeys.push(...hadTaskIdData.map((v: any) => v.refId));
                this.selectObjects.push(...hadTaskIdData);
              }
            });
          } else {
            this.flatList.forEach((r: any) => {
              const index = this.selectedRowKeys.indexOf(r.refId);
              if (~index) {
                this.selectedRowKeys.splice(index, 1);
                this.selectObjects.splice(index, 1);
              }
            });
          }

          this.$emit(
            "select",
            [...new Set(this.selectedRowKeys.concat(selectKeys))],
            this.selectObjects
          );
        },
      };
    },
  },

  data() {
    const _expandKeys: Array<string | number> = [];
    const _flatList = [];
    const _showMappings = false;
    const _activeRecord: any = {};

    return {
      disabled: false,
      expandKeys: _expandKeys,
      flatList: _flatList,
      showMappings: _showMappings,
      activeRecord: _activeRecord,
      selectObjects: [],
    };
  },

  created() {
    Bus.$on("forceUpdateExpand", this.forceUpdate);
    this.changeInitExpandKeys(this.list);
  },

  beforeUnmount() {
    Bus.$off("forceUpdateExpand", this.forceUpdate);
  },

  methods: {
    getRowKey(record) {
      return record.refId;
    },
    rowClassName(record) {
      if (record.mergeConflict) {
        return "row-red";
      }

      return record.gap % 2 === 0
        ? "row-gray"
        : record.isRoot
        ? "row-root"
        : "row-white";
    },

    columns(): TableColumn[] {
      const columns: TableColumn[] = [
        {
          key: "ObjName",
          title: "对象oid(名称)",
          dataIndex: "ObjName",
          customRender: ({ record }) => {
            const { isReuse, otherAppId = "" } = record;

            return (
              <div class="flex-ac" style="display: inline-flex">
                {otherAppId ? (
                  <span style="color: orange;">
                    {record.oid}({record.objName})
                  </span>
                ) : (
                  <span
                    class="text-link"
                    onClick={this.onView.bind(this, record)}
                  >
                    {record.oid}({record.objName})
                  </span>
                )}
                {isReuse && (
                  <a-tag class="g-ml-16" color="orange">
                    复用对象
                  </a-tag>
                )}
              </div>
            );
          },
          customCell: (record) => {
            let background = record.isRoot
              ? "#dee2e6"
              : genBackground(record.gap);

            if (record.mergeConflict) {
              background = "#fbe9eb";
            }

            return {
              style: {
                background,
                "min-width": "200px",
              },
            };
          },
        },
        {
          key: "objType",
          title: "对象类型",
          dataIndex: "objType",
          customRender: ({
            text: type,
          }: {
            text: TaskRelObjectTypeEnum;
            record: any;
          }) => {
            let text = "";
            for (const { key, value } of objectType) {
              if (key === type) {
                text = value;
              }
            }
            return <span>{text}</span>;
          },
          customCell: () => {
            return {
              style: {
                "min-width": "80px",
              },
            };
          },
        },
        {
          key: "reqType",
          title: "需求类型",
          dataIndex: "reqType",
          customRender: ({
            text: reqType,
            record,
          }: {
            text: ReqObjectTypeEnum;
            record: any;
          }) => {
            return record.id ? reqType : "";
          },
          customCell: () => {
            return {
              style: {
                "min-width": "80px",
              },
            };
          },
        },
        {
          key: "owner",
          title: "负责人",
          dataIndex: "owner",
          customRender: ({ text, record }: { text: string; record: any }) => {
            return record.id ? <span>{text || "-"}</span> : "";
          },
        },
        {
          key: "verifier",
          title: "验证人",
          dataIndex: "verifier",
          customRender: ({ text, record }: { text: string; record: any }) => {
            return record.id ? <span>{text || "-"}</span> : "";
          },
        },
        {
          key: "status",
          title: "SPM状态",
          dataIndex: "status",
          customRender: ({
            text: status,
            record,
          }: {
            text: ReqStatusEnum;
            record: any;
          }) => {
            return record.id ? <StatusTag status={status}></StatusTag> : "";
          },
          customCell: () => {
            return {
              style: {
                "min-width": "80px",
              },
            };
          },
        },
        {
          key: "hasPicture",
          title: "是否上传图片",
          dataIndex: "hasPicture",
          customRender: ({ text: hasPicture, record }) => {
            return record.id ? (hasPicture ? "是" : "否") : "";
          },
          customCell: () => {
            return {
              style: {
                "min-width": "80px",
              },
            };
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 180,
          fixed: "right",
          customRender: ({ record }: { record: TaskRelObjDto }) => {
            if (!record.id) return;
            // 能否编辑
            const canEdit = record.status < ReqStatusEnum.ONLINE;
            const operateText = taskOperateTextMap[record.status]; // 能否操作（开发完成、测试完成）
            const canReturn = ![
              ReqStatusEnum.START,
              ReqStatusEnum.ONLINE,
            ].includes(record.status);
            const showReturn =
              record.status !== ReqStatusEnum.START &&
              record.status !== ReqStatusEnum.ONLINE;
            if (canEdit) {
              return (
                <span>
                  {operateText && (
                    <u-text-button
                      disabled={this.checkAuth(
                        AuthCodeMap.get(record.status) || this.hasNoEditAuth
                      )}
                      on-click={this.onOperate.bind(this, record, operateText)}
                    >
                      {operateText}
                    </u-text-button>
                  )}
                  {showReturn && (
                    <u-text-button
                      disabled={this.checkAuth(
                        [1005, 1006, 1007, 1008] || this.hasNoEditAuth
                      )}
                      on-click={this.onReject.bind(this, record)}
                    >
                      回退
                    </u-text-button>
                  )}
                </span>
              );
            } else {
              return (
                <div class="flex-ac">
                  {showReturn && (
                    <u-text-button
                      disabled={this.checkAuth(
                        [1005, 1006, 1007, 1008] || this.hasNoEditAuth
                      )}
                      on-click={this.onReject.bind(this, record)}
                    >
                      回退
                    </u-text-button>
                  )}
                </div>
              );
            }
          },
        },
      ];

      return columns;
    },

    forceUpdate() {
      this.$forceUpdate();
    },

    // 获取初始化展开的key集合
    getInitExpandKeys(list = this.list) {
      return list.reduce((prev, next: any) => {
        prev.push(next.refId);

        if (next.children) {
          prev.push(...this.getInitExpandKeys(next.children));
        }

        return prev;
      }, []);
    },

    getUpdatedData(record = this.record, keys?, fromDrawer?, changeTask?) {
      // @ts-ignore
      return this.$attrs.onRefreshTask(record, keys, fromDrawer, changeTask);
    },

    generatorSpm(record) {
      return record.spm.split("|");
    },

    // 新旧埋点映射
    onNewAndOidMapping(record) {
      this.activeRecord = record;
      this.showMappings = true;
    },

    // 对象详情
    onView(record) {
      import("../../object/list/ObjectEditDrawer.vue").then(
        ({ default: ObjectEditDrawer }) => {
          this.$createInstance(ObjectEditDrawer, {
            id: record.objId,
            trackerId: record.trackerId,
            historyId: !record.id ? record.historyId || null : "",
            record,
            task: this.record,
            reqPoolId: this.requireId,
            isList: this.displayType === "list",
            spm: record.spmByObjId,
            conditions: { terminalIds: this.record.terminalId },
            getUpdatedData: this.getUpdatedData,
            isPreview: true,
            showSampleData: true,
            isDiff: true,
          });
        }
      );
    },

    // 编辑对象
    onEdit(record: TaskRelObjDto) {
      const spm =
        this.displayType === "tree" ? this.generatorSpm(record) : null;
      this.disabled =
        record.relObjMaxStatus !== ReqStatusEnum.START &&
        record.relObjMaxStatus !== ReqStatusEnum.WAIT_VRFY;

      this.$createInstance(ObjectEditDrawer, {
        id: record.objId,
        spm,
        record,
        historyId: record.historyId || null,
        disabled: this.disabled,
        conditions: { terminalIds: this.record.terminalId },
        isList: this.displayType === "list",
        getUpdatedData: this.getUpdatedData,
        onUpdateDisabled: (disabled) => {
          this.disabled = disabled;
        },
        onOk: (data) => {
          this.getUpdatedData(this.record, null, null, {
            obj: record,
            changeTask: (data.trackers || []).map((tracker) => tracker.taskId),
          });

          this.$attrs.onChangeExpandKey(this.requireId);
        },
      });
    },
    goTestRecord(record) {
      getSpm(record.spmByObjId).then((res) => {
        window.open(
          `/tracker/requirement/record?trackerId=${record.id}&spm=${res || ""}`
        );
      });
    },
    // 跳到下一个流程
    async onOperate(record: TaskRelObjDto) {
      const operate = () => {
        forwardTaskData(record.id)
          .then(() => {
            this.$message.success("操作成功");
            this.getUpdatedData(this.record);
          })
          .catch(() => {});
      };

      operate();
    },

    // 打回
    onReject(record) {
      backTaskData(record.id).then(() => {
        this.$message.success("回退成功~");
        this.getUpdatedData(this.record);
      });
    },
    changeTable(pagination: TablePagination) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
    },
    optionExpandKeys(expand, record) {
      if (expand) {
        if (record.children && record.children.length) {
          this.expandKeys.push(record.refId);
        }
      } else {
        const index = this.expandKeys.indexOf(record.refId);

        if (~index) {
          this.expandKeys.splice(index, 1);
        }
      }
    },
    setRecursionExpandKeyds(expand, record) {
      if (record.id && record.children && !record.children.length) {
        if (expand) {
          this.$attrs.onGetExtraSubTree(this.record.id, record).then((res) => {
            record.children = res;
            record.childs = res;
            this.$forceUpdate();
            this.optionExpandKeys(expand, record);
          });
        }
      }

      this.optionExpandKeys(
        expand,
        record
      )(record.children || []).forEach((node) => {
        if (node.children && node.children.length) {
          this.setRecursionExpandKeyds(expand, node);
        }
      });
    },

    expand(expand, record) {
      this.setRecursionExpandKeyds(expand, record);
    },

    changeInitExpandKeys(n) {
      this.$nextTick(() => {
        if (this.hasSearch) {
          this.expandKeys = this.getInitExpandKeys(n);
        }

        this.flatList = this.$attrs.onGetDedpuList(n) || [];
      });
    },
  },
  watch: {
    list: {
      handler: "changeInitExpandKeys",
    },
  },
});
</script>

<style lang="less">
.m-table__row {
  background: #f6f7fa;
}
.row-white {
  background: #fff;
}
.row-gray {
  background: #f6f7fa;
}
.row-root {
  background: #dee2e6;
}
.row-red {
  background: #fbe9eb !important;
}
</style>
