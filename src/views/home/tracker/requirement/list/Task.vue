<template>
  <div class="g-p-lr-24">
    <div class="top">
      <u-left-right class="c-left__right">
        <a-button
          type="primary"
          :disabled="batchBtnDisabled"
          @click="onBatchDeliver"
          >批量指派</a-button
        >
        <OptionButton
          @refresh="[(selectedRowKeys = []), sync()];"
          :disabled="batchBtnDisabled"
          :selectTask="selectTask"
          :selectObject="selectObject"
        />
        <template #right="">
          <s-table-search
            v-model:search="s"
            :width="350"
            placeholder="请输入对象oid/名称、事件编码/名称搜索"
            @sync="sync"
            @search="sync(true, true)"
          ></s-table-search>
        </template>
      </u-left-right>
    </div>
    <TaskFilter
      :conditions="filterConditions"
      :terminalLists="terminalLists"
      ref="taskFilterRef"
      @reset="onReset"
      @filterChange="onFilterChange"
    ></TaskFilter>
    <TaskList
      class="g-mt-16"
      :list="list"
      :loading="loading"
      :pagination="pagination"
      :selectedRowKeys="selectedRowKeys"
      :selectedObjectRowKeys="selectedObjectRowKeys"
      :hasSearch="hasSearch"
      @select="onTableSelect"
      @changeExpandKey="changeExpandKey"
      @objectRowSelect="onObjectRowSelect"
      @changeTable="onChangeTable"
      @changeLoading="changeLoading"
      @sync="sync"
      @setMemoDisplay="setMemoDisplay"
      @refreshTask="sync"
    ></TaskList>
    <SettingVersion
      @refresh="sync"
      :selectTask="selectedRowKeys"
      v-model:show="showVersion"
    ></SettingVersion>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, shallowReactive } from "vue";
import TaskFilter from "./TaskFilter.vue";
import TaskList from "./TaskList.vue";
import BatchOperateModal from "./BatchOperateModal.vue";
import ObjectChangeDrawer from "./ObjectChangeDrawer.vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { ReqStatusEnum, TaskDto } from "@/types/requirement.type";
import { getTaskListFull } from "@/services/requirement.service";
import { removeObjectNullProperty } from "@/utils/common";
import RejectTaskModal from "./RejectTaskModal.vue";
import Bus from "@/bus";
import SettingVersion from "./SettingVersion.vue";
import { getTerminalList } from "@/services/terminal.service";
import OptionButton from "../components/OptionButton.vue";
import { useRoute, useRouter } from "vue-router";

export interface FilterDto {
  spt: any;
  tId: string | number;
  sts: ReqStatusEnum | "all";
  ps: ReqStatusEnum | "all";
  pv: string;
  po: string;
  doe: string;
  issue: string;
  to: string;
  tv: string;
  terV: string;
  s: string;
}
const relObjMaps = {};
const searchMap = {
  issue: "reqIssueKey",
  spt: "sprint",
  tId: "terminalId",
  sts: "status",
  ps: "processStatus",
  po: "processOwner",
  pv: "processVerifier",
  doe: "dataOwnerEmail",
  to: "taskOwner",
  tv: "taskVerifier",
  terV: "terminalVersion",
  s: "search",
};

export default defineComponent({
  name: "Task",
  components: {
    TaskFilter,
    SettingVersion,
    TaskList,
    OptionButton,
  },
  mixins: [TableMixin],

  setup() {
    const router = useRouter();
    const route = useRoute();
    const _type: 1 | 2 | null = null;
    const terminalLists = shallowReactive([]);
    const taskFilterRef = ref<typeof TaskFilter>(null);

    onMounted(() => {
      getTerminalList({ search: "", currentPage: 1, pageSize: 100 }).then(
        (res) => {
          terminalLists.push(...(res.list || []));
        }
      );
    });

    return {
      type: _type,
      taskFilterRef,
      terminalLists,
      reqName: ref<string>(),
      issue: ref<string>(),
      ps: ref<string>(),
      po: ref<string>(),
      pv: ref<string>(),
      to: ref<string>(),
      tv: ref<string>(),
      tId: ref<string | number>(),
      spt: ref<any>(),
      doe: ref<string | number>(),
      terV: ref<string | number>(),
      s: ref<string>(),
      route,
      router,
    };
  },

  props: {
    reqIssueKeys: {},
    activeId: {},
    canCreateOrChangeObj: {},
  },
  computed: {
    filterConditions(): FilterDto {
      return {
        issue: this.issue,
        spt: this.spt,
        tId: this.tId,
        sts: this.sts,
        ps: this.ps,
        po: this.po,
        pv: this.pv,
        doe: this.doe,
        to: this.to,
        tv: this.tv,
        terV: this.terV,
        s: this.s,
      };
    },

    batchBtnDisabled() {
      return !this.selectedRowKeys.length && !this.selectedObjectRowKeys.length;
    },

    getCustomeColumn() {
      return [
        {
          label: "对象oid(名称)",
          value: "name",
          disabled: true,
        },
        {
          label: "对象类型",
          value: "objType",
          disabled: false,
        },
        {
          label: "需求类型",
          value: "reqType",
          disabled: false,
        },
        {
          label: "负责人",
          value: "owner",
          disabled: false,
        },
        {
          label: "验证人",
          value: "verifier",
          disabled: false,
        },
        {
          label: "状态",
          value: "status",
          disabled: false,
        },
        {
          label: "是否上传图片",
          value: "containsImg",
          disabled: false,
        },
        {
          label: "测试记录条数",
          value: "checkHistorySum",
          disabled: false,
        },
      ];
    },
  },

  data() {
    const _showVersion = false;

    // 设置版本
    const _memorizeDisplay = {};

    // 记住上次点击的任务的displayType
    const _memoryKey: number = null;
    const _list: TaskDto[] = [];
    const _status: ReqStatusEnum | "all" = null;
    const _owner = null;
    const _verifier = null;
    const _version = null;
    const _objType: string = null;
    const _oldSpm = "";
    const _search = "";
    const _selectTask: any = [];

    // 获取选中的任务
    const _selectObject: any = [];

    // 获取选中对象
    const _freezeTask: any = [];

    // 分页前冻结所选任务
    const _freezeObject: any = [];

    // 分页前冻结所选对象
    const _hasSearch = false;
    const _index = 0;
    const _selectedRowKeys: number[] = [];

    // 勾选的task记录
    const _selectedObjectRowKeys: string[] = [];

    return {
      showVersion: _showVersion,
      memorizeDisplay: _memorizeDisplay,
      memoryKey: _memoryKey,
      list: _list,
      status: _status,
      owner: _owner,
      verifier: _verifier,
      version: _version,
      objType: _objType,
      oldSpm: _oldSpm,
      search: _search,
      selectTask: _selectTask,
      selectObject: _selectObject,
      freezeTask: _freezeTask,
      freezeObject: _freezeObject,
      hasSearch: _hasSearch,
      index: _index,
      selectedRowKeys: _selectedRowKeys,
      selectedObjectRowKeys: _selectedObjectRowKeys,
      loading: false,
    };
  },

  created() {
    this.loading = false;
    Bus.$on("sync-task", this.sync);
    this.getTaskFilters();

    const { params } = useRoute();

    params.id && (this.issue = params.id);

    this.$nextTick().then(() => {
      this.sync();
    });
  },

  beforeUnmount() {
    Bus.$off("sync-task");
  },

  methods: {
    handleFilterConditions(filters) {
      const result = {};

      Object.keys(filters).forEach((key) => {
        const value = filters[key];

        result[searchMap[key] || key] = value;
      });

      return result;
    },

    // 自定义列项
    onColKeysChange() {
      Bus.$emit("forceUpdateExpand");
    },

    changeLoading(loading) {
      this.loading = loading;
    },

    changeExpandKey(id) {
      this.memoryKey = id;
    },

    getTaskFilters() {
      const route = useRoute();
      const { query } = route;

      this.current = query.currentPage || this.current;
      this.pageSize = query.pageSize || this.pageSize;
      this.s = query.s || this.s;
      this.sts = Number(query.sts) || this.sts;
      this.to = query.to || this.to;
      this.tv = query.tv || this.tv;
      this.terV = query.terV || this.terV;
      this.issue = query.issue || this.issue;
      this.tId = Number(query.tId) || this.tId;
      this.ps = Number(query.ps) || this.ps;
      this.pv = query.pv || this.pv;
      this.doe = query.doe || this.doe;
      this.po = query.po || this.po;
      this.spt = query.spt || this.spt;

      query.reqIssueKeys &&
        this.$emit("update:reqIssueKeys", query.reqIssueKeys);
    },

    setQuery(customQuery) {
      const query = new URLSearchParams(window.location.search);
      Object.keys(customQuery).forEach((key) => {
        const value = customQuery[key];

        if (value !== undefined && value !== null) {
          query.set(key, customQuery[key]);
        } else {
          query.delete(key);
        }
      });

      window.history.replaceState(
        history.state,
        "",
        `${window.location.origin}${
          window.location.pathname
        }?${query.toString()}`
      );
    },

    sync(init = false, hasSearch = false) {
      this.loading = true;

      init && (this.current = 1);

      const reqOptions = removeObjectNullProperty({
        currentPage: this.current,
        pageSize: this.pageSize,
        ...this.handleFilterConditions(this.filterConditions),
      });

      const params = {
        currentPage: this.current,
        pageSize: this.pageSize,
        ...this.filterConditions,
      };

      this.setQuery(params);

      !hasSearch && (this.hasSearch = false);

      getTaskListFull(reqOptions)
        .then((res) => {
          hasSearch && (this.hasSearch = !!this.search.trim());

          const list = res?.list || [];

          list.forEach((item: any) => {
            const { taskProcess = {} } = item;
            const deleteSpmTree = taskProcess.deleteSpmTree || {};
            const devSpmTree = taskProcess.devSpmTree || {};

            item.devSpmList = this.getTaskPropertyLoop(devSpmTree, 1);
            item.deleteSpmList = this.getTaskPropertyLoop(deleteSpmTree, 1);
          });

          this.total = res.totalNum;
          this.list = list;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getOnlySelectKeys(selectedRowKeys) {
      const obj = {};

      return selectedRowKeys.reduce((prev, next) => {
        const prevkey = next.toString().split("-")[0];

        if (!obj[prevkey]) {
          prev.push(+prevkey);
          obj[prevkey] = true;
        }

        return prev;
      }, []);
    },

    onBatchDeliver() {
      this.$createInstance(BatchOperateModal, {
        selectedRowKeys: this.getOnlySelectKeys(this.selectedRowKeys),
        selectedObjectRowKeys: this.getOnlySelectKeys(
          this.selectedObjectRowKeys
        ),
        onHandlerOk: () => {
          this.sync();
        },
      });
    },

    // 批量跳转下一步
    refresh() {},

    // 设置任务关联对象显示缓存
    setMemoDisplay(row) {
      this.memorizeDisplay[row.id] = row.displayType;
    },

    // 批量自定义打回
    onBatchGoBack() {
      const status = this.getLowestStatus();

      this.$createInstance(RejectTaskModal, {
        status,
        selectedRowKeys: this.getOnlySelectKeys(this.selectedRowKeys),
        selectedObjectRowKeys: this.getOnlySelectKeys(
          this.selectedObjectRowKeys
        ),
        isBatch: true,
        onOk: () => {
          this.sync();
          this.clearSelectKeys();
        },
      });
    },

    onSettingVersion() {
      this.showVersion = true;
    },

    clearSelectKeys() {
      this.freezeTask.length = 0;
      this.freezeObject.length = 0;
      this.selectTask.length = 0;
      this.selectObject.length = 0;
      this.selectedRowKeys = [];
      this.selectedObjectRowKeys = [];

      this._.update();
    },

    // 获取选中的任务和对象最小的状态值
    getLowestStatus() {
      const flatTaskObject = this.getFlatTaskObject();
      return flatTaskObject
        .slice(0)
        .sort((a, b) => (a.status > b.status ? 1 : -1))[0].status;
    },

    // 获取扁平化任务和对象
    getFlatTaskObject() {
      return this.selectTask.concat(this.selectObject);
    },

    onReset() {
      this.owner = null;
      this.verifier = null;
      this.status = null;
      this.sts = null;
      this.version = null;
      this.objType = null;
      this.issue = null;
      this.spt = null;
      this.tId = null;
      this.ps = null;
      this.po = null;
      this.pv = null;
      this.doe = null;
      this.to = null;
      this.tv = null;
      this.terV = null;
      this.s = null;
      this.sync(true);
    },

    onFilterChange(key: string, v: any) {
      this[key] = v;
      this.filterConditions[key] = v;
      this.sync(true);
    },

    onTableSelect(selectedRowKeys: number[]) {
      const selectTask = this.list.filter((task) =>
        selectedRowKeys.includes(task.id)
      );
      this.selectTask = this.freezeTask.concat(selectTask);
      this.selectedRowKeys = selectedRowKeys;
    },

    onObjectRowSelect(selectedRowKeys: string[], selectObjects) {
      this.selectObject = selectObjects;
      this.selectedObjectRowKeys = selectedRowKeys;
    },

    onChangeTable(pagination) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
      this.freezeTask = this.selectTask.slice(0);
      this.freezeObject = this.selectObject.slice(0);

      this.sync();
    },

    // 循环tree结构拼装数据
    getTaskPropertyLoop(
      { roots = [], entities = [], objInfos = [] },
      gap,
      parentSpm = ""
    ) {
      return roots.map((v, index) => {
        const data = entities.find((ent) => v.spmByObjId === ent.spmByObjId);
        const objectInfo = objInfos.find((ent) => v.objId === ent.objId);

        data && Object.assign(v, data);
        objectInfo && Object.assign(v, objectInfo);

        v.gap = gap;
        v.refId = v.id + "-" + index + "-" + gap;
        v.spmLink = [v.oid, ...parentSpm.split("|")].filter(Boolean).join("|");

        gap === 1 && (v.isRoot = true);

        v.children =
          v.children && !!v.children.length
            ? this.getTaskPropertyLoop(
                { roots: v.children, entities, objInfos },
                gap + 1,
                v.spmLink
              )
            : undefined;

        v.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = v), false);
        v.isReuse && (relObjMaps[v.objId].isReuse = true);

        // 生成spm
        v.spmLink = this.generateSpmLink(v, objInfos);
        return v;
      });
    },

    generateSpmLink(record = null, objInfos = []) {
      if (!record) return "";

      const spmList = [];
      const { spmByObjId } = record;
      const oidList = spmByObjId.split("|");

      oidList.forEach((item: any) => {
        const objInfo = objInfos.find((obj: any) => obj.objId === Number(item));
        spmList.push(objInfo.oid);
      });

      return spmList.join("|");
    },

    // 变更对象
    onCreateOrChangeObject() {
      this.$createInstance(ObjectChangeDrawer, {
        requireId: this.activeId,
        onOk: () => {
          Bus.$emit("sync-task");
        },
      });
    },

    changeActiveId() {
      this.expandedRowKeys = [];
      this.oldSpm = "";
      this.search = "";

      this.onReset();
    },
  },
  watch: {
    activeId: {
      handler: "changeActiveId",
    },
  },
});
</script>

<style lang="less" scoped="true">
.top {
  padding: 10px 0;
  border-bottom: 1px solid @border-color-split;
}
:deep(.c-icon__setting .u-icon-button) {
  font-size: 22px;
}
.icon-download {
  font-size: 20px;
  margin-right: 16px;
  cursor: pointer;
}
.c-left__right {
  :deep(.flex-ac) {
    flex-wrap: nowrap !important;
  }
}
</style>
