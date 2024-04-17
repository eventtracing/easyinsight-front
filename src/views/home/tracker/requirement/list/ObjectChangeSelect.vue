<template>
  <div>
    <div>
      <div class="text-title g-mb-4">基线版本</div>
      <u-info-item
        v-for="{ terminalName, baseReleaseId } in terminalVersions"
        :key="terminalName"
        :label="`${terminalName}：`"
        class="g-mt-8"
        >{{ baseReleaseId || "无" }}</u-info-item
      >
    </div>
    <div class="g-mt-24" style="position: relative">
      <div>
        <div>
          <span class="g-mr-12">终端视图</span>
          <a-select
            v-model:value="terminalId"
            :options="terminalList"
            optionFilterProp="label"
            show-search
            @change="setTerminalId"
            placeholder="请选择终端"
            style="width: 120px"
            class="g-mr-8"
          >
          </a-select>
          <span class="g-mr-12">标签</span>
          <a-select
            v-model:value="tagSearch"
            :allowClear="true"
            :options="tagList"
            optionFilterProp="label"
            placeholder="请选择标签"
            style="width: 120px"
            class="g-mr-8"
          >
          </a-select>
          <a-input
            @keydown.enter="searchChange"
            placeholder="请输入对象名称/oid搜索"
            :style="`width: 300px`"
            :disabled="viewLevel"
            allowClear=""
          ></a-input>
        </div>
        <div style="margin-top: 24px">
          <a-button type="primary" @click="onBatchCreateObj(true)"
            >直接新建对象</a-button
          >
          <a-button
            type="primary"
            class="g-m-lr-16"
            :disabled="!selectedRowKeys.length"
            @click="onBatchCreateObj(false)"
            >新建子对象</a-button
          >
          <a-button
            type="primary"
            class="g-m-le-16"
            :disabled="!selectedRowKeys.length"
            @click="reuseObj"
            >复用开发</a-button
          >
        </div>
      </div>
      <a-table
        v-show="!viewLevel"
        class="g-mt-16"
        size="middle"
        :columns="columns"
        :dataSource="list"
        :loading="loading"
        :rowKey="(record) => record.spmLink"
        :rowSelection="rowSelection"
        :expandedRowKeys="expandedRowKeys"
        @expand="onExpanded"
      ></a-table>
      <a-table
        v-show="viewLevel"
        class="g-mt-16"
        size="middle"
        :columns="columns"
        :dataSource="levelList"
        :pagination="false"
        :loading="loading"
        :rowClassName="rowClassName"
        :rowKey="(record) => record.id"
        :rowSelection="rowSelection"
      ></a-table>
      <a-modal
        :visible="showTerminal"
        :title="terminalTitle"
        @cancel="showTerminal = false"
        @ok="sureTerminal"
      >
        <TerminalList />
      </a-modal>
    </div>
  </div>
</template>

<script lang="tsx">
import {
  computed,
  defineComponent,
  ref,
  watch,
  PropType,
  watchEffect,
} from "vue";
import { TableMixin } from "@/ndsc-vue3/utils/lib";
import { TablePagination, TableColumn } from "@/types/table.type";
import { ObjTreeItemDto, ObjTypeEnum } from "@/types/object.type";
import { getPreTerminalVersion } from "@/services/terminalVersion.service";
import { getTagList } from "@/services/tag.service";
import { getObjTreeList, reuseObj } from "@/services/object.service";
import { v4 as uuidv4 } from "uuid";
import { generateExpandKeys } from "@/utils/common";
import TerminalList from "./TerminalList.vue";
import { getTerminalList } from "@/services/terminal.service";
import { message } from "ant-design-vue";

var relObjMaps = {};

export default defineComponent({
  name: "ObjectChangeSelect",
  mixins: [TableMixin],
  components: { TerminalList },
  props: {
    requireId: {},
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
  },
  setup() {
    const showTerminal = ref<boolean>(false);
    const activeId = ref<number>();
    const terminalId = ref<any>("");
    const tagSearch = ref();

    watch(
      () => showTerminal.value,
      (n) => {
        if (!n) {
          activeId.value = null;
        }
      }
    );

    return {
      tagSearch,
      terminalId,
      showTerminal,
      activeId,
      terminalTitle: computed(() => (activeId ? "删除" : "新增") + "终端"),
    };
  },
  computed: {
    rowSelection() {
      return {
        columnWidth: 48,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows: ObjTreeItemDto[]) => {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRowIds = selectedRows.map((v) => v.id);
          this.selectInfoIds = selectedRows.map((ele) => ({
            objId: ele.objId,
            historyId: ele.historyId,
          }));
        },
      };
    },

    columns(): TableColumn[] {
      const slots = {
        title: () => (
          <span>当前对象所在行上下分别展示上一级父对象和下一级子对象</span>
        ),
      };
      return [
        {
          key: "name",
          title: "对象oid(名称)",
          dataIndex: "name",
          customRender: ({
            text,
            record,
          }: {
            text: string;
            record: ObjTreeItemDto;
          }) => {
            const { otherAppId = "" } = record;
            return record.center ? (
              <a-tooltip v-slots={slots}>
                {otherAppId ? (
                  <div>
                    {record.oid}({text})
                  </div>
                ) : (
                  <div on-click={this.onViewObj.bind(this, record)}>
                    {record.oid}({text})
                  </div>
                )}
              </a-tooltip>
            ) : (
              <span>
                {otherAppId ? (
                  <span style="color: orange;">
                    {record.oid}({text})
                  </span>
                ) : (
                  <a onClick={this.onViewObj.bind(this, record)}>
                    {record.oid}({text})
                  </a>
                )}
              </span>
            );
          },
        },
        {
          key: "type",
          title: "对象类型",
          dataIndex: "type",
          customRender: ({
            text: type,
            record,
          }: {
            text: ObjTypeEnum;
            record: ObjTreeItemDto;
          }) => {
            const text = type === ObjTypeEnum.PAGE ? "页面" : "元素";
            return record.center ? (
              <a-tooltip v-slots={slots}>
                <div>{text}</div>
              </a-tooltip>
            ) : (
              <span>{text}</span>
            );
          },
        },
        {
          key: "tags",
          title: "SPM标签",
          dataIndex: "tags",
          customRender: ({ text }) => {
            return (text || []).map((item) => item.name).join(" | ");
          },
        },
        {
          key: "owner",
          title: "终端",
          dataIndex: "owner",
          customRender: ({ text, record }: { text: string; record: any }) => {
            return <span>{text || "-"}</span>;
          },
        },
        {
          key: "operation",
          title: "操作",
          width: 100,
          fixed: this.viewLevel ? false : "right",
          customRender: ({ record }: { record: ObjTreeItemDto }) => {
            return (
              <span>
                {record.canChange && (
                  <u-text-button
                    on-click={this.onChangeObject.bind(this, record)}
                  >
                    变更
                  </u-text-button>
                )}
              </span>
            );
          },
        },
      ];
    },
  },

  data() {
    return {
      terminalVersions: [],
      search: "",
      tagIds: [],
      list: [],
      selectedRowKeys: [],
      selectedRowIds: [],
      expandedRowKeys: [],
      viewLevel: false,
      levelList: [],
      selectInfoIds: [],
      terminalList: [],
      tagList: [],
      terminalType: "",
    };
  },

  async created() {
    this.terminalVersions = await getPreTerminalVersion(this.reqPoolId);
    getTerminalList({
      currentPage: 1,
      pageSize: 50,
      search: "",
    }).then((res) => {
      this.terminalList.push(
        ...res.list.map((v) => ({
          ...v,
          value: v.id,
          label: v.name,
        }))
      );

      const cacheTerminalId: any = localStorage.getItem("terminalId");
      const cacheTerminalType: any = localStorage.getItem("terminalType");
      if (res.list.length) {
        if (
          cacheTerminalId &&
          res.list.find((ele) => ele.id === Number(cacheTerminalId))
        ) {
          this.terminalId = Number(cacheTerminalId);
          this.terminalType = cacheTerminalType;
        } else {
          this.terminalId = res.list[0].id;
          this.terminalType = res.list[0].terminalType;
        }
      }

      watchEffect(() => {
        this.sync(true);
      });
    });
    getTagList({
      currentPage: 1,
      pageSize: 100,
      search: "",
      type: 2,
    }).then((res) => {
      this.tagList = (res.list || []).map((item) => ({
        ...item,
        label: item.name,
        value: item.name,
      }));
    });
  },

  methods: {
    optionTerminal(record?) {
      if (record) {
        this.activeId = record.id;
      }

      this.showTerminal = true;
    },
    sureTerminal() {
      this.showTerminal = false;
    },
    sync(init = false) {
      this.loading = true;
      this.expandedRowKeys = [];
      this.selectedRowKeys = [];
      this.selectedRowIds = [];

      init && (this.current = 1);

      const reqOptions = {
        currentPage: this.current,
        pageSize: this.pageSize,
        search: this.search.trim(),
        terminalId: this.terminalId,
        tagSearch: this.tagSearch,
        reqPoolId: this.requireId,
      };

      getObjTreeList(reqOptions)
        .then((res: any) => {
          relObjMaps = {};
          this.total = res.totalNum;
          this.list = this.getTaskPropertyLoop(res.tree, res.objInfoMap);
          this.loading = false;
          const spmsToExpand = generateExpandKeys(res?.spmsToExpand || []);
          this.expandedRowKeys = spmsToExpand;

          if (res.totalNum > 0 && res.list.length === 0 && this.current > 1) {
            this.current -= 1;
            this.sync();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    searchChange(e) {
      this.search = e.target.value;
    },
    // 循环tree结构拼装数据
    getTaskPropertyLoop(roots = [], entities = {}, parentSpm = "") {
      return roots?.map((v) => {
        const data = entities[v.objId];

        data && Object.assign(v, data);

        v.uuid = uuidv4();
        v.spmLink = [v.oid, ...parentSpm.split("|")].filter(Boolean).join("|");

        v.children =
          v.children && !!v.children.length
            ? this.getTaskPropertyLoop(v.children, entities, v.spmLink)
            : undefined;
        v.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = v), false);

        v.isReuse && (relObjMaps[v.objId].isReuse = true);

        return v;
      });
    },

    onSearch() {
      this.$nextTick(() => {
        this.sync(true);
      });
    },

    filterOption(input: any, option: any) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.trim().toUpperCase()) >= 0
      );
    },

    onViewObj(record: ObjTreeItemDto) {
      this.$emit("viewObj", record, this.terminalId);
    },
    // 高亮中间元素
    rowClassName(record) {
      return record.center ? "center-tr" : "";
    },
    // 本地缓存终端
    setTerminalId(val) {
      const terminalList = this.terminalList;
      const type = terminalList?.find((ele) => ele.id === val)?.terminalType;

      this.terminalType = type;

      localStorage.setItem("terminalId", val);
      localStorage.setItem("terminalType", type);
    },
    onBackToList() {
      this.selectedRowKeys = [];
      this.selectedRowIds = [];
      this.viewLevel = false;
    },

    // 对象变更
    onChangeObject(record) {
      this.$emit("next", "change", record.id, record.historyId);
    },
    // 复用开发
    reuseObj() {
      const params = {
        objectBatchParams: this.selectInfoIds,
        reqPoolId: this.reqPoolId,
      };

      reuseObj(params).then(() => {
        this.sync(false);
        message.success("复用成功");
        this.$emit("refresh");
      });
    },
    onCreateObject(record: ObjTreeItemDto) {
      this.$emit("next", "create", [record.id]);
    },

    onBatchCreateObj(withoutParent = false) {
      this.$emit(
        "oncreatenext",
        "create",
        withoutParent ? [] : this.selectedRowIds,
        this.terminalType,
        this.terminalId
      );
    },

    async onExpanded(
      expanded: boolean,
      record: ObjTreeItemDto & { uuid: string }
    ) {
      const idx = this.expandedRowKeys.findIndex((v) => v === record.spmLink);

      if (expanded) {
        idx === -1 && this.expandedRowKeys.push(record.spmLink);
      } else {
        this.expandedRowKeys.splice(idx, 1);
      }
    },

    onChangeTable(pagination: TablePagination) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
    },
  },
});
</script>

<style lang="less">
.ant-table-row.center-tr {
  background: rgba(251, 141, 24, 0.1);
}
</style>
