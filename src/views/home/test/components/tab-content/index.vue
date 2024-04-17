<template>
  <div class="fill">
    <div class="header-wrapper fill">
      <a-tabs
        type="card"
        class="fill"
        @change="handleTabChange"
        :active-key="activityTab"
      >
        <a-tab-pane
          class="flex"
          key="1"
          tab="树模式校验"
          :disabled="routerTab !== '1'"
        >
          <div
            class="fill flex"
            style="flex: none; position: relative; padding-bottom: 50px"
            v-drag-size.right="{ minWidth: 700, maxWidth: 1100 }"
          >
            <div
              class="fill"
              style="overflow-y: auto; width: 100%; min-width: 700px"
            >
              <div
                class="left fill"
                style="
                  min-width: 700px;
                  width: 100%;
                  padding-top: 20px;
                  position: relative;
                "
              >
                <div
                  class="flex"
                  style="margin-bottom: 10px; align-items: center"
                >
                  <a-input-search
                    placeholder="请输入对象oid(名称)搜索"
                    class="input"
                    @search="handleTreeSearch"
                    style="width: 230px; margin-right: 10px"
                  />
                  <a-checkbox :checked="showFail" @change="handleShowFail">
                    {{ showText }}：<span>{{ showNumber }}</span>
                  </a-checkbox>
                  <span style="color: #103ffa; margin-left: 10px">
                    统计区的日志是全部的，不受清空影响
                  </span>
                </div>
                <div style="margin-top: 20px" v-if="unMatchTableCount">
                  <a-collapse>
                    <a-collapse-panel key="1">
                      <template #header>
                        <div>
                          <span>未匹配上的SPM </span>
                          <span style="color: red">{{
                            unMatchTableCount
                          }}</span>
                        </div>
                      </template>
                      <a-table
                        :columns="unMatchSpmColumns"
                        size="small"
                        :pagination="false"
                        :data-source="unMatchTableDataList"
                        :customRow="unMatchRow"
                      >
                        <template #spm="{ text }">
                          <div
                            v-ellipsis-title
                            style="width: 400px; overflow: hidden"
                          >
                            {{ text }}
                          </div>
                        </template>
                        <template #spmName="{ text }">
                          <div style="max-width: 600px; overflow: hidden">
                            {{ text }}
                          </div>
                        </template>
                        <template #num="{ text }">
                          <span style="color: red">{{ text }}</span>
                        </template>
                      </a-table>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
                <h3 style="margin-top: 10px; color: #103ffa; font-size: 18px">
                  需求涉及纯事件和SPM
                </h3>
                <a-table
                  v-if="this.$route.query.taskId"
                  :columns="requireTableColumns"
                  size="small"
                  :pagination="false"
                  :data-source="tableDataList"
                  :customRow="customEventRow"
                >
                  <template #eventName="{ _, record }">
                    <div>
                      {{ `${record.eventCode}(${record.eventName})` }}
                    </div>
                  </template>
                  <template #details="{ text }">
                    <div
                      v-for="item in text"
                      :key="item.eventCode"
                      style="margin-right: 10px"
                    >
                      <span>{{ item.eventCode || "" }}:</span>
                      <span>{{ item.num || 0 }}/</span>
                      <span style="color: green">{{ item.passSum || 0 }}/</span>
                      <span style="color: red">{{ item.failSum || 0 }}/</span>
                      <span style="color: #103ffa"
                        >{{ item.hitSum || 0 }}/</span
                      >
                      <span style="color: #103ffa">{{ item.reqSum || 0 }}</span>
                    </div>
                  </template>
                </a-table>

                <tree-table
                  style="margin-top: 20px"
                  v-show="taskName"
                  :treeColumns="treeColumns"
                  :treeList="taskTreeList"
                  :currentTreeRecord="currentTreeRecord"
                  @updateCurrentTreeRecord="updateCurrentTreeRecord"
                />
                <h3 style="margin-top: 20px; color: #103ffa; font-size: 18px">
                  全量纯事件和SPM(含回归)
                </h3>
                <a-table
                  :columns="tableColumns"
                  size="small"
                  :pagination="false"
                  :data-source="baseObjDataList"
                  :customRow="customBaseRow"
                >
                  <template #eventName="{ _, record }">
                    <div>{{ record.eventCode }}</div>
                  </template>
                  <template #details="{ _, record }">
                    <div>
                      <span>{{ record.eventCode || "" }}:</span>
                      <span>{{ record.num || 0 }}/</span>
                      <span style="color: green"
                        >{{ record.passSum || 0 }}/</span
                      >
                      <span style="color: red">{{ record.failSum || 0 }}</span>
                    </div>
                  </template>
                </a-table>
                <tree-table
                  :showFail="showFail"
                  :treeColumns="treeColumns"
                  :treeList="baseTreeList"
                  :currentTreeRecord="currentTreeRecord"
                  @updateCurrentTreeRecord="updateCurrentTreeRecord"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 right fill" style="position: relative">
            <div>
              <p v-if="currentType === 'event'">
                当前选中的event：
                <span style="color: #103ffa">
                  {{ currentEventRecord.eventCode || "" }}
                </span>
              </p>
              <p v-else>
                当前选中的spm：
                <span style="color: #103ffa">
                  {{ currentTreeRecord.spm || "" }}
                </span>
              </p>
              <div
                v-if="currentType !== 'event' && currentTreeRecord.eventCode"
              >
                当前选中事件: {{ currentTreeRecord.eventCode }}
              </div>
            </div>
            <div
              v-if="extraRecords && extraRecords.length"
              class="cover-branch-box"
            >
              <div class="cover-branch-box-left">未覆盖分支</div>
              <div class="cover-branch-box-right">无需测试</div>
            </div>
            <div
              v-for="(record, index) in extraRecords"
              :key="record"
              class="cover-branch-box"
              style="color: red"
            >
              <div class="cover-branch-box-left">{{ record }}</div>
              <div class="cover-branch-box-right">
                <IgnoreCheckbox
                  :index="index"
                  :conversationId="conversation"
                  :record="shouldCoverData[index]"
                  @onDelete="deleteRecord"
                />
              </div>
            </div>
            <point-list
              :columns="selectedColumns"
              :type="1"
              :logType="1"
              :currentRecord="currentTreeRecord"
              :updateNum="logUpdateNum"
              :eventId="currentEventCode || currentBaseEventCode"
              :clearLog="clearLog"
              :deviceInfo="deviceInfo"
              :taskName="taskName"
              :reqTaskName="reqTaskName"
            />
          </div>
        </a-tab-pane>
        <a-tab-pane key="0" tab="时序模式校验" :disabled="routerTab !== '1'">
          <div class="fill flex">
            <div class="left fill">
              <log-list
                :data="logData"
                @updateSearchType="updateModeTimeEventId"
                title="日志统计(定义区)"
              />
              <undefined-log-stats
                :data="undefinedStatistics"
                @updateSearchType="updateModeTimeEventId"
                title="日志统计(未定义区)"
              />
              <log-list
                :data="oldLOgData"
                @updateSearchType="updateOldEventId"
                title="旧版日志统计"
              />
            </div>
            <div class="flex-1 right fill">
              <a-input-search
                placeholder="请输入"
                class="input"
                :value="modeTimeSearchValue"
                @change="onModeTimeInputChange"
                @search="handleModeTimeSearch"
              />
              <column-setting
                :columns="columns"
                :value="tempColumnKeys"
                @visibleChange="visibleChange"
                @columnChange="columnChange"
                @handleOk="handleOk"
              />
              <a-checkbox
                :checked="showTimeModeFail"
                @change="handleTimeModeShowFail"
                style="margin-left: 15px"
                v-if="logData.checkFailedlogNum"
              >
                {{ showText }}
              </a-checkbox>
              <span>{{ logData.checkFailedlogNum || "" }}</span>
              <point-list
                :columns="selectedColumns"
                :type="1"
                :logType="1"
                :searchStr="modeTimeSearchStr"
                :eventId="timeModeEventId"
                :updateNum="logUpdateNum"
                :checkType="showTimeModeFail"
                :clearLog="clearLog"
                :deviceInfo="deviceInfo"
                :taskName="taskName"
                :reqTaskName="reqTaskName"
              />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="实时日志">
          <div class="fill flex">
            <div class="left fill">
              <log-list
                :data="logData"
                @updateSearchType="updateRealTimeEventId"
                title="日志统计(定义区)"
              />
              <undefined-log-stats
                :data="undefinedStatistics"
                @updateSearchType="updateRealTimeEventId"
                title="日志统计(未定义区)"
              />
              <log-list
                :data="oldLOgData"
                @updateSearchType="updateOldEventId"
                title="旧版日志统计"
              />
            </div>
            <div class="flex-1 right fill" style="padding-bottom: 100px">
              <a-input-search
                placeholder="请输入"
                class="input"
                :value="realTimeSearchValue"
                @change="onRealTimeInputChange"
                @search="handleRealTimeSearch"
              />
              <column-setting
                :columns="columns.filter((item) => item.key !== 'checkResult')"
                :value="tempColumnKeys"
                @visibleChange="visibleChange"
                @columnChange="columnChange"
                @handleOk="handleOk"
              />
              <point-list
                :columns="
                  selectedColumns.filter((item) => item.key !== 'checkResult')
                "
                :updateNum="logUpdateNum"
                :type="2"
                :logType="1"
                :searchStr="realTimeSearchStr"
                :eventId="realTimeEventId"
                :clearLog="clearLog"
                :taskName="taskName"
                :reqTaskName="reqTaskName"
                :deviceInfo="deviceInfo"
              />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="实时日志(旧版)">
          <div class="fill flex">
            <div class="left fill flex-none">
              <log-list
                :data="oldLOgData"
                @updateSearchType="updateOldEventId"
                title="旧版日志统计"
              />
            </div>
            <div class="fill right flex-1">
              <div style="float: right; margin-bottom: 10px">
                <column-setting
                  :columns="oldColumns"
                  :value="tempOldColumnKeys"
                  @visibleChange="visibleChange"
                  @columnChange="columnChange"
                  @handleOk="handleOk"
                />
              </div>
              <point-list
                :columns="selectedColumns"
                :type="2"
                :logType="2"
                :eventId="oldEventId"
                :updateNum="oldLogUpdateNum"
                :taskName="taskName"
                :reqTaskName="reqTaskName"
                :deviceInfo="deviceInfo"
              />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #tab
            ><span>
              <a-badge
                :count="activityTab !== '4' ? exceptionLogNum : 0"
                :overflow-count="99"
                :offset="[-3, 0]"
              >
                错误信息
              </a-badge>
            </span>
          </template>
          <div class="fill flex">
            <div class="left fill">
              <error-list
                :data="exceptions"
                @updateErrorCode="updateErrorEventId"
                title="错误信息"
              />
            </div>
            <div class="flex-1 right fill">
              <point-list
                :columns="errorColumns"
                from="error"
                :type="1"
                :logType="3"
                :eventId="errorEventId"
                :updateNum="exceptionLogNum"
                :taskName="taskName"
                :reqTaskName="reqTaskName"
                :deviceInfo="deviceInfo"
              />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, reactive } from "vue";
import LogList from "../log-list/index.vue";
import PointList from "../point-list/index.vue";
import ColumnSetting from "../column-setting/index.vue";
import ErrorList from "../error-list/index.vue";
import UndefinedLogStats from "../undefined-log-stats/index.vue";
import TreeTable from "../tree-table/index.vue";
import { genBackground } from "@/utils/common";
import IgnoreCheckbox from "../ignore-checkbox.vue";

const localSelectedColumnKeys = localStorage.getItem("selectedColumnKeys");
const localOldSelectedColumnKeys = localStorage.getItem(
  "selectedOldColumnKeys"
);
declare let env: string;
const ENV = env;
export default defineComponent({
  name: "tab-content",
  components: {
    "log-list": LogList,
    "point-list": PointList,
    "column-setting": ColumnSetting,
    "error-list": ErrorList,
    "undefined-log-stats": UndefinedLogStats,
    "tree-table": TreeTable,
    IgnoreCheckbox,
  },

  setup() {
    const _visible = false;
    const _showQRCode = false;

    const _treeColumns = reactive([
      {
        title: "对象oid(名称)",
        dataIndex: "oid",
        key: "oid",
        slots: {
          customRender: "oid",
        },
        customCell: (record) => {
          const background = record.isRoot
            ? "#dee2e6"
            : genBackground(record.gap);

          return {
            style: { background },
          };
        },
      },
      {
        title: "需求类型",
        dataIndex: "type",
        key: "type",
        width: 120,
        slots: {
          customRender: "type",
        },
      },
      {
        title: "日志总数/通过数/不通过数/覆盖分支数/待测分支数",
        dataIndex: "details",
        width: "30%",
        key: "details",
        slots: {
          customRender: "details",
        },
      },
    ]);

    const _errorColumns = reactive([
      {
        title: "code",
        dataIndex: "code",
        key: "code",
        slots: {
          customRender: "error-code",
        },
      },
      {
        title: "category",
        dataIndex: "category",
        key: "category",
        slots: {
          customRender: "error-category",
        },
      },
      {
        title: "日志获取时间",
        dataIndex: "timestamp",
        key: "timestamp",
        slots: {
          customRender: "time",
        },
      },
    ]);

    return {
      visible: _visible,
      showQRCode: _showQRCode,
      treeColumns: _treeColumns,
      errorColumns: _errorColumns,
    };
  },

  props: {
    logData: {
      type: Object,
      default: () => {},
    },
    oldLOgData: {
      type: Object,
      default: () => {},
    },
    undefinedStatistics: {
      type: Object,
      default: () => {},
    },
    exceptions: {
      type: Array,
      default: () => [],
    },
    baseTree: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    unMatchTableData: {
      type: Array,
      default: () => [],
    },
    baseObjData: {
      type: Array,
      default: () => [],
    },
    taskTree: {
      type: Array,
      default: () => [],
    },
    taskName: {
      type: String,
      default: "",
    },
    deviceInfo: {
      type: Object,
      default: () => {},
    },
    reqTaskName: {
      type: String,
      default: "",
    },
    conversation: {
      type: Number,
    },
  },
  computed: {
    currentTreeRecord() {
      const currentRecord = this.$store.state.liveTest.currentRecord;
      return currentRecord;
    },
    currentEventRecord() {
      return this.$store.state.liveTest.currentEventRecord;
    },
    timeModeEventId() {
      return this.$store.state.liveTest.timeModeEventId;
    },

    realTimeEventId() {
      return this.$store.state.liveTest.realTimeEventId;
    },

    oldEventId() {
      return this.$store.state.liveTest.oldEventId;
    },

    errorEventId() {
      return this.$store.state.liveTest.errorEventId;
    },

    exceptionLogNum() {
      return this.$store.state.liveTest.exceptionLogNum;
    },

    logUpdateNum() {
      return this.$store.state.liveTest.logUpdateNum;
    },

    oldLogUpdateNum() {
      return this.$store.state.liveTest.oldLogUpdateNum;
    },

    clearLog() {
      return this.$store.state.liveTest.clearLog;
    },
    showType() {
      const { type } = this.$store.state.liveTest.selectShow;
      return type;
    },
    showText() {
      const { type } = this.$store.state.liveTest.selectShow;
      const textMap = {
        1: "只显示已通过需求测试分支",
        2: "只显示未通过需求测试分支",
        3: "只显示未覆盖需求测试分支",
        4: "只显示已通过全量测试分支",
        5: "只显示未通过全量测试分支",
      };

      return textMap[type];
    },
    showNumber() {
      return this.$store.state.liveTest.selectShow.number;
    },
    showFail() {
      return this.$store.state.liveTest.showFail;
    },
    extraRecords() {
      const extraRecords = this.$store.state.liveTest.extraRecords;

      return extraRecords;
    },
    shouldCoverData() {
      return this.$store.state.liveTest.shouldCoverData || [];
    },
    selectedColumns() {
      if (this.activityTab === "3") {
        return this.oldColumns.filter((column) =>
          this.selectedOldColumnKeys.includes(column.key)
        );
      }

      return this.columns.filter((column) =>
        this.selectedColumnKeys.includes(column.key)
      );
    },

    filterColumns() {
      return this.activityTab === "3" ? this.oldColumns : this.colu·mns;
    },

    taskTreeList() {
      const filterValues: any = [1, 2, 3];
      const initList = [];
      let tempList = this.taskTree;

      if (this.treeSearchValue) {
        tempList = tempList.filter((item) => {
          const str = JSON.stringify(item);
          return str.includes(this.treeSearchValue);
        });
      }

      if (this.showFail && filterValues.includes(this.showType)) {
        this.filtersTaskList(tempList, initList);
        return initList;
      }
      this.setGapTree(tempList, 0);

      return tempList;
    },

    baseTreeList() {
      let tempList = this.baseTree;
      const filterValues: any = [4, 5];
      const initList = [];
      if (this.treeSearchValue) {
        tempList = tempList.filter((item) => {
          const str = JSON.stringify(item);
          return str.includes(this.treeSearchValue);
        });
      }

      if (this.showFail && filterValues.includes(this.showType)) {
        this.filtersBaseList(tempList, initList);
        return initList;
      }

      this.setGapTree(tempList, 0);

      return tempList;
    },
    tableDataList() {
      let tempList = this.tableData;
      if (this.showFail) {
        tempList = tempList.filter((item) => item?.details[0]?.failSum > 0);
      }
      return tempList;
    },
    unMatchTableDataList() {
      const tempList = this.unMatchTableData;
      return tempList;
    },
    unMatchTableCount() {
      const count = this.unMatchTableData?.reduce((pre, cur) => {
        return pre + cur.num;
      }, 0);
      return count;
    },
    baseObjDataList() {
      let tempList = this.baseObjData;
      if (this.showFail) {
        tempList = tempList.filter((item) => item.failSum > 0);
      }
      return tempList;
    },

    failNumbers() {
      const baseTreeNum = this.baseTree;
      const taskTreeNum = this.taskTree;
      const tableDataNum =
        this.tableData.length > 0 &&
        (this.tableData.details || []).reduce((prev, cur) => {
          return prev + cur.failSum;
        }, 0);
      const baseObjDataNum =
        this.baseObjData.length > 0 &&
        (this.baseObjData || []).reduce((prev, cur) => {
          return prev + cur.failSum;
        }, 0);
      return (
        this.getFailNum(baseTreeNum) +
        this.getFailNum(taskTreeNum) +
        baseObjDataNum +
        tableDataNum
      );
    },
  },

  data() {
    const _envHostName: string = window.location.hostname;
    const _routerTab = this.$route.query.tab;
    const _activityTab = this.$route.query.tab;
    const _errorCode = "";
    const _treeSearchValue = "";
    const _currentType = "spm";
    const _selectedColumnKeys = localSelectedColumnKeys
      ? JSON.parse(localSelectedColumnKeys)
      : ["eventCode", "firstObjOid", "logServerTime", "checkResult", "opts"];

    const _selectedOldColumnKeys = localOldSelectedColumnKeys
      ? JSON.parse(localOldSelectedColumnKeys)
      : ["action", "mspm", "resourceType", "resourceId", "opts"];

    const _tempColumnKeys = [];
    const _tempOldColumnKeys = [];
    const _columns = [
      {
        title: "eventCode(事件类型名称)",
        dataIndex: "eventCode",
        key: "eventCode",
        slots: {
          customRender: "event",
        },
      },
      {
        title: "第一层对象oid（对象名称）",
        dataIndex: "firstObjOid",
        key: "firstObjOid",
        slots: {
          customRender: "first",
        },
      },
      {
        title: "spm",
        dataIndex: "spm",
        key: "spm",
      },
      {
        title: "Index",
        dataIndex: "index",
        key: "index",
      },
      {
        title: "日志获取时间",
        dataIndex: "logServerTime",
        key: "logServerTime",
        slots: {
          customRender: "time",
        },
      },
      {
        title: "验证结果",
        dataIndex: "checkResult",
        key: "checkResult",
        width: 195,
        ellipsis: true,
        slots: {
          customRender: "result",
        },
      },
      {
        title: "操作",
        key: "opts",
        width: 100,
        slots: {
          customRender: "opts",
        },
      },
    ];
    const _tableColumns = [
      {
        title: "纯事件Code(名称)",
        dataIndex: "eventName",
        key: "eventName",
        slots: {
          customRender: "eventName",
        },
      },
      {
        title: "日志总数/通过数/不通过数",
        dataIndex: "details",
        slots: {
          customRender: "details",
        },
      },
    ];
    const _requireTableColumns = [
      {
        title: "纯事件Code(名称)",
        dataIndex: "eventName",
        key: "eventName",
        slots: {
          customRender: "eventName",
        },
      },
      {
        title: "日志总数/通过数/不通过数/分支覆盖数/待测分支数",
        dataIndex: "details",
        slots: {
          customRender: "details",
        },
      },
    ];
    const _oldColumns = [
      {
        title: "actioin(事件类型)",
        dataIndex: "action",
        key: "action",
      },
      {
        title: "mspm(埋点ID)",
        dataIndex: "mspm",
        key: "mspm",
      },
      {
        title: "target_id(去向)",
        dataIndex: "targetId",
        key: "targetId",
      },
      {
        title: "resource_type(资源类型)",
        dataIndex: "resourceType",
        key: "resourceType",
      },
      {
        title: "resource_id(资源ID)",
        dataIndex: "resourceId",
        key: "resourceId",
      },
      {
        title: "日志获取时间",
        dataIndex: "logServerTime",
        key: "logServerTime",
        slots: {
          customRender: "time",
        },
      },
      {
        title: "操作",
        key: "opts",
        width: 100,
        slots: {
          customRender: "opts",
        },
      },
    ];
    const _unMatchSpmColumns = [
      {
        title: "未匹配上的SPM",
        dataIndex: "spm",
        slots: {
          customRender: "spm",
        },
      },
      {
        title: "未匹配上的SPM名称",
        dataIndex: "spmName",
        slots: {
          customRender: "spmName",
        },
      },
      {
        title: "不通过日志数",
        dataIndex: "num",
        slots: {
          customRender: "num",
        },
      },
    ];
    return {
      envHostName: _envHostName,
      routerTab: _routerTab,
      activityTab: _activityTab,
      errorCode: _errorCode,
      treeSearchValue: _treeSearchValue,
      selectedColumnKeys: _selectedColumnKeys,
      selectedOldColumnKeys: _selectedOldColumnKeys,
      tempColumnKeys: _tempColumnKeys,
      tempOldColumnKeys: _tempOldColumnKeys,
      columns: _columns,
      oldColumns: _oldColumns,
      tableColumns: _tableColumns,
      requireTableColumns: _requireTableColumns,
      unMatchSpmColumns: _unMatchSpmColumns,
      modeTimeSearchStr: "",
      modeTimeSearchValue: "",
      realTimeSearchStr: "",
      realTimeSearchValue: "",
      treeUpdateFlag: false,
      timeModeUpdateFlag: false,
      realTimeUpdateFlag: false,
      oldUpdateFlag: false,
      errorUpdateFlag: false,
      currentEventCode: "",
      currentBaseEventCode: "",
      showTimeModeFail: false,
      currentType: _currentType, // 区分点击的是事件还是spm对象
    };
  },

  methods: {
    setGapTree(treeList, gap) {
      if (!Array.isArray(treeList)) return;

      treeList.forEach((tree) => {
        if (Array.isArray(tree.children) && tree.children.length) {
          this.setGapTree(tree.children, gap + 1);
        }

        if (gap) {
          tree.gap = gap;
        } else {
          tree.gap = 0;
          tree.isRoot = true;
        }
      });
    },

    onModeTimeInputChange(e) {
      const { value } = e.target;
      this.modeTimeSearchValue = value;
    },

    filtersTaskList(list, initList) {
      list.forEach((item) => {
        const { children, ...rest } = item;
        const { details } = rest;

        if (this.showType === 1) {
          details?.forEach((item) => {
            if (item.passSum) {
              initList.push(rest);
            }
          });
        }

        if (this.showType === 2) {
          details?.forEach((item) => {
            if (item.failSum) {
              initList.push(rest);
            }
          });
        }

        if (this.showType === 3) {
          details?.forEach((item) => {
            if (item.reqSum - item.hitSum) {
              initList.push(rest);
            }
          });
        }

        if (children && children.length > 0) {
          this.filtersTaskList(children, initList);
        }
      });
    },

    filtersBaseList(list, initList) {
      list.forEach((item) => {
        const { children, ...rest } = item;
        const { details } = rest;

        if (this.showType === 4) {
          details?.forEach((item) => {
            if (item.passSum) {
              initList.push(rest);
            }
          });
        }

        if (this.showType === 5) {
          details?.forEach((item) => {
            if (item.failSum) {
              initList.push(rest);
            }
          });
        }

        if (children && children.length > 0) {
          this.filtersBaseList(children, initList);
        }
      });
    },
    getFailNum(list) {
      const res = list.reduce((prev1, cur) => {
        const addNum =
          prev1 +
          (cur.details || []).reduce((prev, cur) => {
            return prev + cur.failSum;
          }, 0) +
          this.getFailNum(cur.children || []);
        return addNum;
      }, 0);
      return res;
    },
    handleModeTimeSearch(value) {
      this.modeTimeSearchStr = value;
    },

    onRealTimeInputChange(e) {
      const { value } = e.target;
      this.realTimeSearchValue = value;
    },

    handleRealTimeSearch(value) {
      this.realTimeSearchStr = value;
    },

    handleTreeSearch(value) {
      this.treeSearchValue = value;
    },

    handleShowFail(e) {
      const showFail = e.target.checked;
      this.$store.commit("setShowFail", showFail);
    },

    handleTimeModeShowFail(e) {
      this.showTimeModeFail = e.target.checked;
    },

    visibleChange(visible) {
      if (visible) {
        if (this.activityTab === "3") {
          this.tempOldColumnKeys = this.selectedOldColumnKeys;
        } else {
          this.tempColumnKeys = this.selectedColumnKeys;
        }
      }
    },

    columnChange(value) {
      if (this.activityTab === "3") {
        this.tempOldColumnKeys = value;
      } else {
        this.tempColumnKeys = value;
      }
    },

    handleOk() {
      if (this.activityTab === "3") {
        this.selectedOldColumnKeys = this.tempOldColumnKeys;
        localStorage.setItem(
          "selectedOldColumnKeys",
          JSON.stringify(this.tempOldColumnKeys)
        );
      } else {
        this.selectedColumnKeys = this.tempColumnKeys;
        localStorage.setItem(
          "selectedColumnKeys",
          JSON.stringify(this.tempColumnKeys)
        );
      }
    },

    handleTabChange(key) {
      this.activityTab = key;
    },

    updateModeTimeEventId(value, from) {
      this.handleTabRoute(from);

      this.$store.commit("setTimeModeEventId", value);
    },

    updateRealTimeEventId(value, from) {
      this.handleTabRoute(from);

      this.$store.commit("setRealTimeEventId", value);
    },

    updateOldEventId(value) {
      this.activityTab = "3";

      this.$store.commit("setOldEventId", value);
    },

    updateErrorEventId(value, from) {
      this.$store.commit("setErrorEventId", value);
    },

    handleTabRoute(from) {
      if (this.activityTab === "3") {
        this.activityTab = this.routerTab;
      }

      if (from === "undefined") {
        this.activityTab = "2";
      }
    },

    closeConnect() {
      this.$emit("closeConnect");
    },

    updateCurrentTreeRecord(record) {
      this.currentEventCode = "";
      this.currentBaseEventCode = "";
      this.currentType = "spm";
      this.$store.commit("setCurrentRecord", record);
    },

    findSpm(list, spm) {
      let flag = false;

      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];

        if (item.spm === spm) {
          return true;
        } else if (item.childs && item.childs.lenght) {
          flag = flag || this.findSpm(item.childs, spm);
        }
      }

      return flag;
    },
    customEventRow(record) {
      return {
        style: {
          "background-color":
            record.eventCode === this.currentEventCode ? "#f3f7ff" : "#ffffff",
        },
        onClick: () => {
          this.currentType = "event";
          this.currentEventCode = record.eventCode;
          this.$store.commit("setCurrentEventRecord", record);
        },
      };
    },
    unMatchRow(record) {
      return {
        // style: {
        //   'background-color': record.eventCode === this.currentEventCode ? '#f3f7ff' : '#ffffff'
        // },
        onClick: () => {
          this.currentEventCode = "";
          this.currentBaseEventCode = "";
          this.currentType = "spm";
          this.$store.commit("setCurrentRecord", record);
        },
      };
    },
    customBaseRow(record) {
      return {
        style: {
          "background-color":
            record.eventCode === this.currentBaseEventCode
              ? "#f3f7ff"
              : "#ffffff",
        },
        onClick: () => {
          this.currentType = "event";
          this.currentBaseEventCode = record.eventCode;
          this.$store.commit("setCurrentEventRecord", record);
        },
      };
    },
    getSpmListByShowType(list: any) {
      const showType = this.showType;

      if (showType === 1) {
        return list.filter((item) => item?.details[0]?.passSum > 0);
      }

      if (showType === 2) {
        return list.filter((item) => item?.details[0]?.failSum > 0);
      }

      if (showType === 3) {
        return list.filter(
          (item) => item?.details[0]?.reqSum - item?.details[0]?.hitSum
        );
      }

      return list;
    },
    deleteRecord(index) {
      this.extraRecords.splice(index, 1);
      this.shouldCoverData.splice(index, 1);

      this.$emit("refreshData");
    },
  },
});
</script>

<style lang="less" scoped="true">
:deep(.ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane) {
  height: 100%;
}

.left {
  width: 300px;
  border-right: 1px solid @border-color-split;
  padding: 10px;
  padding-top: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20vh;
}

.right {
  padding: 10px;
  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: 20vh;
  .search-bar {
    position: absolute;
    top: 0;
    right: 0;
  }
  .input {
    width: 230px;
    margin-right: 10px;
  }

  .cover-branch-box {
    display: flex;
    align-items: center;

    &-left {
      flex: 1;
      word-break: break-all;
    }

    &-right {
      display: inline-block;
      width: 80px;
    }
  }
}
:deep(.v-drag-size-anchor__right) {
  right: 2px;
}
:deep(.ant-tabs-no-animation > .ant-tabs-content > .ant-tabs-tabpane-inactive) {
  display: none;
}
:deep(.ant-collapse-content > .ant-collapse-content-box) {
  padding: 0px !important;
}
:deep(.ant-collapse) {
  background-color: white;
}
:deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
  padding: 10px 16px;
  padding-left: 40px;
}
</style>
