<template>
  <div class="g-p-lr-24 g-mt-10">
    <u-left-right class="c-left__right">
      <a-button
        type="primary"
        class="g-mr-8"
        @click="modalProps.visible = true"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        新建需求组
      </a-button>
    </u-left-right>
    <u-divider-dash class="g-mt-8 g-mb-8" />
    <requirement-filter
      :dataOwners="transformDataOwners"
      :creators="creators"
      :conditions="conditions"
      :list="list"
      @filterChange="filterChange"
    />
    <u-divider-dash class="g-mt-8 g-mb-8" />
    <RequirementGroupList
      @optionGroup="(id) => (activeGroupId = id)"
      @onAddReq="onAddReq"
      @sync="sync"
      @change-condition="(order) => (conditions.order = order)"
      :loading="loading"
      :list="list"
      :conditions="conditions"
      v-slot="{ requirements, reqPoolId }"
    >
      <a-table
        style="width: 100%"
        :columns="columns"
        :data-source="requirements"
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'auto' }"
        :rowClassName="rowClassName"
      >
        <template #action="{ record }">
          <router-link
            class="text-link g-mr-8"
            :to="`/tracker/requirement/task${
              record.from.includes('mind')
                ? '/' + record.issueKey + '/om'
                : `/${record.issueKey}`
            }`"
          >
            查看关联任务
          </router-link>
          <u-text-button
            :on-click="() => editRequirement(reqPoolId, record.id)"
            v-auth="1002"
          >
            编辑
          </u-text-button>
          <a-dropdown v-if="record.from.includes('mind')">
            <u-text-button>更多</u-text-button>
            <template #overlay>
              <a-menu @click="onMenuClick($event, record)">
                <a-menu-item key="remove">
                  <span>删除</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <u-text-button v-else :on-click="() => removeRequirement(record.id)">
            删除需求
          </u-text-button>
        </template>
      </a-table>
    </RequirementGroupList>
    <a-modal v-bind="modalProps" @cancel="clearActiveId">
      <a-form
        ref="formRef"
        :rules="rules"
        :model="reqGroupData"
        :label-col="{ span: 5 }"
        v-if="modalProps.visible"
      >
        <RequirementGroup
          :dataOwners="dataOwners"
          :reqGroupData="reqGroupData"
        />
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="tsx" setup>
import {
  ref,
  onMounted,
  getCurrentInstance,
  markRaw,
  shallowReactive,
  computed,
  reactive,
  watchEffect,
  watch,
  nextTick,
} from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import ReqAddDrawer from "./ReqAddDrawer.vue";
import { getTerminalList } from "@/services/terminal.service";
import { getAllUsers } from "@/services/app.service";
import {
  removeRequirement,
  editRequirementGroup,
  addRequirementGroup,
  getRequirementGroup,
  getRequirementGroupDetail,
} from "@/services/requirement.service";
import { createInstance } from "@/ndsc-vue3/utils/lib";
import RequirementFilter from "./RequirementFilter.vue";
import { message, Modal } from "ant-design-vue";
import RequirementGroup from "./RequirementGroup.vue";
import RequirementGroupList from "./RequirementGroupList.vue";
import moment from "moment";

import type { Column } from "@/types/table.type";
import type {
  RequirementGroupRes,
  RequirementGroupParams,
} from "@/types/requirement.type";
import { SourceMap } from "@/types/requirement.type";

const instance = getCurrentInstance(); // 当前组件实例
const search = ref<string>();
const terminalLists = markRaw([]); // 终端列表
const dataOwners = shallowReactive([]); // 数据负责人
const creators = shallowReactive([]); // 创建人
const verifiers = markRaw([]); // 数据验证人
const formRef = ref<any>(); // 新增需求组的表单ref
const loading = ref<boolean>(false); // 需求组列表加载态
const transformDataOwners = computed(() =>
  dataOwners.map((v) => ({
    key: v.value,
    value: v.label,
  }))
);

const reqGroupData = reactive<
  Partial<{ name: string; owners: string[]; desc: string }>
>({
  desc: null,
  name: null,
  owners: [],
});

const rules = {
  name: [{ required: true, message: "请输入需求组名称" }],
  owners: [
    {
      type: "array",
      required: true,
      message: "请选择数据数据负责人",
      validator() {
        return nextTick().then(() => {
          const value = reqGroupData.owners;

          if (value.length) return Promise.resolve();

          throw Promise.reject(new Error("请选择数据负责人"));
        });
      },
    },
  ],
};

const conditions = shallowReactive<RequirementGroupParams>({
  // 筛选条件
  from: undefined,
  dataOwnerEmail: undefined,
  creatorEmail: undefined,
  order: "desc",
});

const columns = markRaw<Column[]>([
  { key: "issueKey", dataIndex: "issueKey", title: "需求ID" },
  { key: "name", dataIndex: "name", title: "需求名称" },
  { key: "from", dataIndex: "from", title: "需求来源" },
  { key: "priority", dataIndex: "priority", title: "需求优先级" },
  {
    key: "omState",
    dataIndex: "omState",
    title: "来源需求状态",
    customRender: ({ text }) => SourceMap[text] || "",
  },
  { key: "views", dataIndex: "views", title: "视图" },
  { key: "businessArea", dataIndex: "businessArea", title: "业务领域" },
  { key: "team", dataIndex: "team", title: "关联团队" },
  { key: "creatorName", dataIndex: "creatorName", title: "创建人" },
  {
    key: "createTime",
    dataIndex: "createTime",
    title: "创建时间",
    customRender({ text }) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    key: "options",
    title: "操作",
    fixed: "right",
    width: 190,
    slots: {
      customRender: "action",
    },
  },
]);

const list = shallowReactive<RequirementGroupRes[]>([]);
const activeGroupId = ref<number>();

// 新增需求组
function optionGroup(id?: number) {
  if (Number.isInteger(id)) activeGroupId.value = id;

  const isEdit = activeGroupId.value;

  formRef.value
    .validate()
    .then((values) => {
      values.owners = values.owners.map((o) => ({
        userName: dataOwners.find((d) => d.value === o)?.label,
        email: o,
      }));

      return isEdit
        ? editRequirementGroup(((values.id = activeGroupId.value), values))
        : addRequirementGroup(values);
    })
    .then(() => {
      message.success(isEdit ? "编辑成功" : "新增成功");
      activeGroupId.value = null;
      sync();
    });
}

const modalProps = shallowReactive({
  title: "新建需求组",
  visible: false,
  onOk: optionGroup,
});

// 更换弹窗title
watchEffect(() => {
  modalProps.title = (activeGroupId.value ? "编辑" : "新建") + "需求组";
});

watch(
  () => modalProps.visible,
  (value) => {
    if (!value) {
      reqGroupData.name = null;
      reqGroupData.desc = null;
      reqGroupData.owners = [];
    }
  }
);

// 需求组编辑完后自动关闭弹窗
watch(
  () => activeGroupId.value,
  (value) => {
    if (!value) {
      clearActiveId();
      return;
    }

    getRequirementGroupDetail(value).then((data) => {
      reqGroupData.name = data.name;
      reqGroupData.desc = data.desc;
      reqGroupData.owners = data.dataOwners.map((v) => v.email);
      modalProps.visible = true;
    });
  }
);

watch(conditions, sync, { immediate: true, deep: true });

// 清除当前选中的需求组
function clearActiveId() {
  activeGroupId.value = undefined;
  modalProps.visible = false;
}

// 获取终端列表以及数据负责人 、 创建人
onMounted(() => {
  getTerminalList({ search: "", currentPage: 1, pageSize: 100 }).then((res) => {
    terminalLists.push(...(res?.list || []));
  });

  getAllUsers().then((res) => {
    dataOwners.push(
      ...res.map((v) => ({
        label: v.userName,
        value: v.email,
      }))
    );

    creators.push(
      ...res.map((v) => ({
        key: v.email,
        value: v.userName,
      }))
    );
  });
});

// 新建需求
function onAddReq(reqPoolId) {
  createInstance(ReqAddDrawer, {
    parentContext: { _: instance },
    terminalLists: terminalLists,
    owners: dataOwners,
    verifiers,
    reqPoolId,
    onHandlerOk: () => {
      sync();
    },
  });
}

// 请求需求组列表
function sync(sorter?) {
  loading.value = true;

  getRequirementGroup(conditions, search.value)
    .then((res) => {
      list.length = 0;
      list.push(...res);
    })
    .finally(() => {
      loading.value = false;
    });
}

// 点击需求操作
function onMenuClick(v, requirement) {
  const key = v.key;

  if (key === "remove") {
    removeRequirementReq(requirement.id);
  }
}

// 编辑需求
function editRequirement(reqPoolId, id) {
  import("./ReqAddDrawer.vue").then(({ default: ReqEditDrawer }) => {
    createInstance(ReqEditDrawer, {
      parentContext: { _: instance },
      id,
      terminalLists: terminalLists,
      owners: dataOwners,
      verifiers,
      reqPoolId,
      onHandlerOk: () => {
        sync();
      },
    });
  });
}

// 删除需求
function removeRequirementReq(id) {
  const instance = Modal.confirm({
    title: "是否删除?",
    onOk() {
      removeRequirement(id).then(() => {
        instance.destroy();
        sync();
      });
    },
  });
}

// 更改搜索选项
function filterChange(key, value) {
  if (typeof value === "object") {
    return;
  }
  conditions[key] = value;
}

function rowClassName(record) {
  return record.mergeConflict ? "row-red" : "";
}
</script>
