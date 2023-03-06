<template>
  <a-table
    size="middle"
    class="task-table"
    :columns="columns"
    :dataSource="list"
    :pagination="pagination"
    :expandedRowKeys="expandedRowKeys"
    :rowSelection="rowSelection"
    :loading="loading"
    :rowKey="(record) => record.id"
    :rowClassName="rowClassName"
    :scroll="{ x: 'auto' }"
    @change="changeTable"
  >
    <template #requirement="{ record, text }">
      <a-dropdown>
        <router-link
          target="_blank"
          style="color: #79809a"
          :to="{
            path: '/tracker/requirement/detail',
            query: { ...$route.query, tab: '2', reqId: String(record.id) },
          }"
        >
          {{ text }}
        </router-link>
        <template #overlay>
          <a-menu @click="onMenuClick">
            <a-menu-item key="edit">
              <span v-auth="1002">编辑需求</span>
            </a-menu-item>
            <a-menu-item key="delete">
              <span>删除需求</span>
            </a-menu-item>
            <template v-if="record.id === 2">
              <a-menu-item key="sync"> 刷新OM信息 </a-menu-item>
              <a-menu-item key="createOrChangeObject"> 刷新OM需求 </a-menu-item>
            </template>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #expandedRowRender="{ record }">
      <div>
        <template v-if="record.devSpmList && record.devSpmList.length">
          <div class="g-mb-8 flex" style="padding: 4px 0">
            <div
              class="g-mr-8"
              style="width: 70px; flex: none; padding-top: 10px"
            >
              待开发对象血缘树
            </div>
            <ExpandObjTable
              style="width: 100%"
              :taskId="record.taskId"
              :record="record"
              :list="record.devSpmList"
              :terminalId="record.terminalId"
              :taskName="record.name"
              :requireId="record.reqPoolId"
              :displayType="record.displayType"
              :hasSearch="hasSearch"
              :selectedRowKeys="selectedObjectRowKeys"
              :hasNoEditAuth="hasNoEditAuth"
              @getDedpuList="getDedpuList"
              @select="handleObjectRowSelected"
              @sync="sync"
              @refreshTask="refreshTask"
              @changeExpandKey="$attrs.onChangeExpandKey"
              @getExtraSubTree="$attrs.onGetExtraSubTree"
            />
          </div>
        </template>
        <template v-if="record.deleteSpmList && record.deleteSpmList.length">
          <div class="g-mb-8 flex" style="padding: 4px 0">
            <div
              class="g-mr-8"
              style="width: 70px; flex: none; padding-top: 10px"
            >
              待下线对象血缘树
            </div>
            <ExpandObjTable
              style="width: 100%"
              :record="record"
              :list="record.deleteSpmList"
              :terminalId="record.terminalId"
              :taskName="record.name"
              :requireId="record.reqPoolId"
              :displayType="record.displayType"
              :hasSearch="hasSearch"
              :selectedRowKeys="selectedObjectRowKeys"
              :hasNoEditAuth="hasNoEditAuth"
              @getDedpuList="getDedpuList"
              @select="handleObjectRowSelected"
              @sync="sync"
              @refreshTask="refreshTask"
              @changeExpandKey="$attrs.onChangeExpandKey"
              @getExtraSubTree="$attrs.onGetExtraSubTree"
            />
          </div>
        </template>
        <template v-if="record.eventsList && record.eventsList.length">
          <div class="g-mb-8 flex" style="padding: 4px 0">
            <div
              class="g-mr-8"
              style="width: 70px; flex: none; padding-top: 10px"
            >
              待开发事件埋点列表
            </div>
            <EventPool
              :dataSource="record.eventsList"
              @changeRowKeys="(e) => changeEventRowKeys(e, record.eventsList)"
              v-slot="{ record: eventRecord }"
            >
              <u-text-button
                :disabled="
                  checkAuth(AuthCodeMap.get(eventRecord.status)) ||
                  hasNoEditAuth
                "
                :on-click="() => onOperateData(eventRecord, record)"
                v-if="operateText(eventRecord)"
              >
                {{ operateText(eventRecord) }}
              </u-text-button>
              <u-text-button
                :disabled="checkAuth([1005, 1006, 1007, 1008]) || hasNoEditAuth"
                :on-click="() => onRejectData(eventRecord, record)"
                v-if="showReturn(eventRecord)"
              >
                回退
              </u-text-button>
              <u-text-button :on-click="() => goTestRecord(eventRecord)">
                测试记录
              </u-text-button>
            </EventPool>
          </div>
        </template>
      </div>
    </template>
    <template #terminal="{ record }">
      <a v-if="record.terminalVersionLink" @click="jump(record)">{{
        record.terminalVersion
      }}</a>
      <span v-else>{{ record.terminalVersion }}</span>
    </template>
  </a-table>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import StatusTag from "../components/StatusTag.vue";
import ExpandObjTable from "./ExpandObjTable.vue";
import TestingModal from "./TestingModal.vue";
import ReqAddDrawer from "./ReqAddDrawer.vue";
import {
  forwardTask,
  forwardTaskData,
  backTaskData,
  getTestList,
  backTask,
} from "@/services/requirement.service";
import { TablePagination, TableColumn } from "@/types/table.type";
import {
  TaskDto,
  taskOperateTextMap,
  ReqStatusEnum,
  TaskRelObjDto,
} from "@/types/requirement.type";
import Bus from "@/bus";
import EventPool from "../detail/RequireTaskDetail/EventPool.vue";

const AuthCodeMap = new Map([
  [ReqStatusEnum.START, 1005],
  [ReqStatusEnum.WAIT_VRFY, 1006],
  [ReqStatusEnum.VRFY_FINISHED, 1007],
  [ReqStatusEnum.DEV_FINISHED, 1008],
]);
export default defineComponent({
  name: "List",
  components: {
    StatusTag,
    ExpandObjTable,
    EventPool,
  },
  setup() {
    function operateText(record) {
      return taskOperateTextMap[record.status];
    }

    function showReturn(record) {
      return (
        record.status !== ReqStatusEnum.START &&
        record.status !== ReqStatusEnum.ONLINE
      );
    }

    return { operateText, AuthCodeMap, showReturn };
  },
  props: {
    hasNoEditAuth: { type: Boolean, default: false },
    requirementDetail: { type: Boolean, default: false },
    list: {},
    loading: { type: Boolean },
    pagination: {},
    selectedRowKeys: {},
    selectedObjectRowKeys: {},
    expandedRowKeys: {},
    hasSearch: {},
  },
  computed: {
    scroll() {
      return { x: "max-content" };
    },

    rowSelection() {
      return {
        getCheckboxProps: (record) => {
          return { disabled: record.status === 6 || record.mergeConflict };
        },

        columnWidth: 48,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRow) => {
          this.$emit("select", selectedRowKeys);
        },
      };
    },

    columns(): TableColumn[] {
      const columns: TableColumn[] = [
        {
          key: "reqPoolId",
          width: 80,
          title: "需求组ID",
          dataIndex: "reqPoolId",
        },
        {
          key: "reqIssueKey",
          width: 80,
          title: "需求ID",
          dataIndex: "reqIssueKey",
        },
        {
          key: "reqName",
          width: 300,
          title: "需求名称",
          dataIndex: "reqName",
        },
        {
          key: "taskName",
          width: 350,
          title: "任务名称",
          dataIndex: "taskName",
          slots: {
            customRender: "taskName",
          },
          customCell: () => {
            return {
              style: {
                "max-width": "300px",
              },
            };
          },
        },
        {
          key: "terminal",
          width: 80,
          title: "终端",
          dataIndex: "terminal",
        },
        {
          key: "terminalVersion",
          width: 180,
          title: "端版本",
          dataIndex: "terminalVersion",
          slots: {
            customRender: "terminal",
          },
        },
        {
          key: "testResult",
          width: 150,
          title: "测试记录(总数/通过/部分通过/未通过)",
          dataIndex: "testResult",
          customCell: () => {
            return {
              style: { "max-width": "80px" },
            };
          },
          customRender: ({ text = {}, record }: any) => {
            const {
              partPassNum = 0,
              passNum = 0,
              sum = 0,
              unPassNum = 0,
            } = text;
            return (
              <div>
                <a
                  style="color: #103ffa"
                  onClick={this.jumpToRecord.bind(this, record, "")}
                >
                  {sum}/
                </a>
                <a
                  style="color: green"
                  onClick={this.jumpToRecord.bind(this, record, 1)}
                >
                  {passNum}/
                </a>
                <a
                  style="color: orange"
                  onClick={this.jumpToRecord.bind(this, record, 2)}
                >
                  {partPassNum}/
                </a>
                <a
                  style="color: red"
                  onClick={this.jumpToRecord.bind(this, record, 0)}
                >
                  {unPassNum}
                </a>
              </div>
            );
          },
        },
        {
          key: "status",
          width: 100,
          title: "任务状态",
          dataIndex: "status",
          customCell: () => {
            return {
              style: { "max-width": "80px" },
            };
          },
          customRender: ({ text: status }: { text: ReqStatusEnum }) => {
            return <StatusTag status={status}></StatusTag>;
          },
        },
        {
          key: "owner",
          width: 80,
          title: "负责人",
          dataIndex: "owner",
          customCell: () => {
            return {
              style: { "max-width": "80px" },
            };
          },
          customRender: ({ text }: { text: string }) => {
            return <span>{text || "-"}</span>;
          },
        },
        {
          key: "verifier",
          width: 80,
          title: "验证人",
          dataIndex: "verifier",
          customRender: ({ text }: { text: string }) => {
            return <span>{text || "-"}</span>;
          },
        },
        {
          key: "dataOnwers",
          width: 100,
          title: "数据负责人",
          dataIndex: "dataOnwers",
        },
        {
          key: "sprint",
          width: 80,
          title: "迭代",
          dataIndex: "sprint",
        },
        {
          key: "operation",
          fixed: "right",
          title: "操作",
          width: this.requirementDetail ? 150 : 220,
          customRender: ({ record }: { record: TaskDto }) => {
            const operateText = taskOperateTextMap[record.status];
            const showReturn =
              record.status !== ReqStatusEnum.START &&
              record.status !== ReqStatusEnum.ONLINE;

            return (
              <span>
                {operateText && (
                  <u-text-button
                    class="g-mr-8"
                    disabled={
                      this.hasNoEditAuth ||
                      record.operating ||
                      this.checkAuth(AuthCodeMap.get(record.status))
                    }
                    on-click={this.onOperate.bind(this, record, operateText)}
                  >
                    {operateText}
                  </u-text-button>
                )}
                {showReturn && (
                  <span
                    class={`g-mr-8 text-link ${
                      this.hasNoEditAuth && "m-text--disabled"
                    }`}
                    onClick={this.onReject.bind(this, record)}
                  >
                    回退
                  </span>
                )}
                {!this.requirementDetail && (
                  <router-link
                    class="text-link g-mr-8"
                    to={`/tracker/requirement/design/${record.reqPoolId}`}
                  >
                    查看埋点设计
                  </router-link>
                )}
              </span>
            );
          },
        },
      ];

      this.requirementDetail && columns.splice(0, 2);

      return columns;
    },
  },
  methods: {
    rowClassName(record) {
      return record.mergeConflict ? "row-red" : "";
    },
    goTestRecord(eventRecord) {
      window.open(
        `/tracker/requirement/record?trackerId=${eventRecord.id}&spm=${eventRecord.spm}&from=event&eventBuryPointId=${eventRecord.eventBuryPointId}`
      );
    },
    async onOperateData(record: TaskRelObjDto, task) {
      const operate = () => {
        forwardTaskData(record.id)
          .then(() => {
            this.$message.success("操作成功");
            this.refreshTask(task);
          })
          .catch(() => {});
      };
      operate();
    },
    // 打回
    onRejectData(record, task) {
      backTaskData(record.id).then(() => {
        this.$message.success("回退成功~");
        this.refreshTask(task);
      });
    },
    editRequirement() {
      this.onMenuClick({ key: "edit" });
    },
    onMenuClick(v) {
      const key = v.key;

      if (key === "edit" && !this.checkAuth(1002)) {
        this.$createInstance(ReqAddDrawer, {
          id: this.requirement.id,
        });
      }
    },
    jumpToRecord(record, result) {
      const { id } = record;
      const appId = localStorage.getItem("appId");
      const url = `/test/record?appId=${appId}&taskId=${id}&result=${result}`;

      window.open(url);
    },
    changeEventRowKeys(eventKeys, eventsList) {
      const keys = eventKeys.map((item) => {
        const newItem = eventsList.find((ele) => ele.eventBuryPointId === item);

        return newItem.id;
      });

      this.$emit("seteventrowkeys", keys);
    },
    getDataSource(row) {
      const { relObjLists: data = [] } = row;

      !row.displayType && (row.displayType = "tree");

      if (row.displayType === "tree") return data;

      const list = this.getDedpuList(data);
      const map = new Map();

      return list.reduce((prev, next) => {
        if (!map.get(next.objId)) {
          map.set(next.objId, true);
          prev.push(next);
        }

        return prev;
      }, []);
    },
    changeDisplay(row) {
      row.displayType = row.displayType === "list" ? "tree" : "list";
      this.$emit("setMemoDisplay", row);

      this._.update();
    },
    getDedpuList(data) {
      return data.reduce((prev, next) => {
        if (next.children?.length) {
          prev.push(...this.getDedpuList(next.children));
        }

        if (next.id) {
          prev.push({ ...next, children: undefined });
        }

        return prev;
      }, []);
    },
    navToDetail(record: TaskDto) {
      this.$router
        .push({
          path: "/tracker/requirement/detail",
          query: {
            ...this.$route.query,
            tab: "1",
            reqId: String(record.requirementId),
            taskId: String(record.id),
          },
        })
        .catch(() => {});
    },
    createTestingModal(list, record) {
      this.$createInstance(TestingModal, {
        list,
        record,
        onHandlerOk: () => this.refreshTask(record),
      });
    },
    async onOperate(record: TaskDto) {
      if (record.status === 4) {
        getTestList(record.id).then((res) => {
          if (res?.result?.length > 0 && res?.result[0]?.testResult !== 0) {
            forwardTask(record.id).then(() => {
              this.$message.success("操作成功");
              this.refreshTask(record);
            });
          } else {
            this.createTestingModal(res || [], record);
          }
        });

        return;
      }

      const operate = () => {
        const hide = this.$message.loading({
          content: "正在操作中...",
          duration: 0,
        });

        record.operating = true;

        forwardTask(record.id)
          .then(() => {
            this.$message.success("操作成功");
            this.refreshTask(record);
          })
          .catch(() => {})
          .finally(() => {
            record.operating = false;
            hide();
          });
      };

      operate();
    },

    // 刷新当前点击的任务
    refreshTask(record, expandedRowKeys?, fromDrawer?, changeTask?) {
      expandedRowKeys = expandedRowKeys || this.expandedRowKeys;
      Bus.$emit("require-sync");

      return this.$attrs.onRefreshTask(
        record,
        expandedRowKeys,
        fromDrawer,
        changeTask
      );
    },

    // 打回
    onReject(record: TaskDto) {
      backTask(record.id).then(() => {
        this.$message.success("回退成功~");
        this.refreshTask(record);
      });
    },

    handleObjectRowSelected(selectedRowKeys: number[], selectObjects) {
      this.$emit("objectRowSelect", selectedRowKeys, selectObjects);
    },

    changeTable(pagination: TablePagination, filter, sorter) {
      this.$emit("changeTable", pagination, filter, sorter);
    },

    sync() {
      this.$emit("sync");
    },

    jump(record) {
      window.open(record.terminalVersionLink);
    },
  },
});
</script>

<style lang="less" scoped>
.task-table {
  :deep(.ant-table .ant-table-expanded-row) {
    background-color: #fff;
  }
}
</style>
