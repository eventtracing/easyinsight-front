<template>
  <div>
    <div class="flex-ac">
      <a-button
        type="primary"
        class="g-mr-8"
        @click="onCreateOrChangeObject"
        :disabled="hasNoEditAuth"
      >
        新建/变更对象
      </a-button>
      <a-button
        class="g-mr-8"
        :disabled="hasNoEditAuth"
        @click="$emit('optionModal', true, 'task')"
      >
        指派任务
      </a-button>
      <a-button class="g-mr-8" :disabled="hasNoEditAuth" @click="cancelAssign">
        取消指派
      </a-button>
      <span id="base"></span>
    </div>
    <div class="g-mt-16 g-mb-16">
      <span class="black">需求对象列表</span>
      <requirement-object
        ref="reqObjectRef"
        @sync="refreshData"
        :searchStr="props.searchStr"
        class="g-mt-16"
        :hasNoEditAuth="hasNoEditAuth"
        :reqPoolId="params.id"
      />
    </div>
    <a-checkbox
      class="g-ml-16"
      v-model:checked="syncAllTerminal"
      @change="changeSyncAllTerminal"
      v-if="!!undoObjectPools.length"
    >
      多端同时操作
    </a-checkbox>
    <a-select
      v-if="syncAllTerminal"
      :options="
        undoObjectPools.map((ele) => ({
          label: ele.terminalName,
          value: ele.terminalId,
        }))
      "
      style="width: 120px"
      v-model:value="checkedTerminal"
    >
    </a-select>
    <a-checkbox
      class="g-ml-16"
      v-model:checked="showPendingTree"
      v-if="!!undoObjectPools.length"
    >
      显示待开发需求对象完整血缘树
    </a-checkbox>
    <a-checkbox
      class="g-ml-16"
      v-if="!!undoObjectPools.length"
      v-model:checked="showUnAssign"
    >
      仅显示未指派SPM
    </a-checkbox>
    <!-- 待开发对象池 -->
    <div v-for="pool in getUndoObjectPools" :key="pool.terminalId">
      <div class="flex-ac g-mt-16 g-mb-16">
        <span class="black">
          待开发对象血缘树(终端视图：{{ pool.terminalName }}）
        </span>
      </div>
      <object-pool
        @changeRowKeys="changeRowKeys($event, 1, pool.terminalId, pool.data)"
        :reqPoolId="params.id"
        :loading="unDoLoading"
        :terminalId="pool.terminalId"
        :data-source="pool.data"
        :spms-to-expand="pool.spmsToExpand"
      />
    </div>
    <u-divider-dash class="g-mb-16" />
    <a-checkbox
      class="g-ml-16"
      v-model:checked="showUndoTree"
      v-if="!!unoutlineObjectPools.length"
    >
      显示待下线需求对象完整血缘树
    </a-checkbox>
    <!-- 待下线对象池 -->
    <div v-for="pool in unoutlineObjectPools" :key="pool.terminalId">
      <div class="flex-ac g-mt-16 g-mb-16">
        <span class="black">
          待下线对象血缘树(终端视图：{{ pool.terminalName }})
        </span>
      </div>
      <object-pool
        @changeRowKeys="changeRowKeys($event, 2, pool.terminalId, pool.data)"
        :reqPoolId="params.id"
        :loading="unOutlineLoading"
        :terminalId="pool.terminalId"
        :data-source="pool.data"
      />
    </div>
    <BaseLineSetting :reqPoolId="params.id" :hasNoEditAuth="hasNoEditAuth" />
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  markRaw,
  reactive,
  getCurrentInstance,
  ref,
  watchEffect,
} from "vue";
import ObjectChangeDrawer from "../../list/ObjectChangeDrawer.vue";
import { useRoute } from "vue-router";
import { createInstance } from "@/ndsc-vue3/utils/lib";
import { generateExpandKeys } from "@/utils/common";
import ObjectPool from "./ObjectPool.vue";
import RequirementObject from "./RequirementObject.vue";
import { getRequirementPendingObject } from "@/services/requirement.design.service";
import { v4 as uuidv4 } from "uuid";
import { message } from "ant-design-vue";

const BaseLineSetting = defineAsyncComponent(
  () => import("./BaseLineSetting.vue")
);

const props = defineProps<{
  hasEditAuthManage: boolean;
  searchStr: string;
}>();

const hasNoEditAuth = computed(() => !props.hasEditAuthManage);
const router = markRaw(useRoute());
const params: any = router.params;
const undoObjectPools = reactive([]);
const unoutlineObjectPools = reactive([]);
const checkedTerminal = ref();
const showPendingTree = ref<boolean>(false);
const showUnAssign = ref<boolean>(false);
const unDoLoading = ref<boolean>(false);
const syncAllTerminal = ref<boolean>(false);
const unOutlineLoading = ref<boolean>(false);
const showUndoTree = ref<boolean>(false);
const refresh = ref<boolean>(false);
const reqObjectRef = ref();
const instance = getCurrentInstance();

function onCreateOrChangeObject() {
  const createInstanceRef = createInstance(ObjectChangeDrawer, {
    parentContext: { _: instance },
    requireId: params.id,
    reqPoolId: params.id,
    onHandlerOk: () => {
      createInstanceRef.destroy();
      refreshData();
      reqObjectRef.value.getRequirementData();
    },
  });
}

var relObjMaps = markRaw({});
// 循环tree结构拼装数据
function getTaskPropertyLoop(
  roots = [],
  entities = [],
  reqs = [],
  gap,
  parentSpm = ""
) {
  return roots.map((v) => {
    const data = entities.find((ent) => v.spmByObjId === ent.spmByObjId);
    const req = reqs.find((req) => req.objId === v.objId);

    req && Object.assign(v, req);
    data && Object.assign(v, data);

    v.gap = gap;

    gap === 1 && (v.isRoot = true);

    v.refId = v.id + "-" + uuidv4();
    v.spmLink = [v.oid, ...parentSpm.split("|")].filter(Boolean).join("|");
    v.children =
      v.children && !!v.children.length
        ? getTaskPropertyLoop(v.children, entities, reqs, gap + 1, v.spmLink)
        : undefined;
    v.isReuse = !!relObjMaps[v.objId] || ((relObjMaps[v.objId] = v), false);
    v.isReuse && (relObjMaps[v.objId].isReuse = true);

    return v;
  });
}

function getRequirementObject(options, datasource, loading) {
  loading.value = true;
  getRequirementPendingObject({ reqPoolId: params.id, ...options })
    .then((res) => {
      datasource.length = 0;
      datasource.push(
        ...res.map((v) => {
          relObjMaps = {};

          return {
            terminalId: v.terminalId,
            terminalName: v.terminalName,
            data: getTaskPropertyLoop(
              v.roots,
              v.reqDevSpmEntities,
              v.baseObjEntities,
              1
            ),
            spmsToExpand: generateExpandKeys(v.spmsToExpand || []),
          };
        })
      );
    })
    .finally(() => {
      loading.value = false;
    });
}

watchEffect(() => {
  refresh.value; // 这是啥？？？

  getRequirementObject(
    {
      reqPoolType: 1,
      showCompleteTree: showPendingTree.value,
      showUnAssign: showUnAssign.value,
      searchStr: props.searchStr,
    },
    undoObjectPools,
    unDoLoading
  );
});
watch(undoObjectPools, () => {
  checkedTerminal.value = undoObjectPools[0]?.terminalId;
});
watchEffect(() => {
  refresh.value; // 这是啥？？？

  getRequirementObject(
    {
      reqPoolType: 2,
      showCompleteTree: showUndoTree.value,
      searchStr: props.searchStr,
    },
    unoutlineObjectPools,
    unOutlineLoading
  );
});

const emit = defineEmits<{
  (e: "selectObject", params);
  (e: "selectOutObject", objects: { id: number; poolType: number }[]);
  (e: "optionModal", init: boolean, type: string);
  (e: "cancelAssign", params, notOperaList);
  (e: "changeSyncAllTerminal", checked: boolean);
}>();
const outlineObject = markRaw({});
const unObj = markRaw({});
function changeSyncAllTerminal(e) {
  const checked = e.target.checked;
  emit("changeSyncAllTerminal", checked);
}
function checkOid(target, sourceArr) {
  let arr = [];
  for (let i = 0; i < sourceArr.length; i++) {
    const item = sourceArr[i];
    if (item.spmLink === target) {
      arr.push(item);
    } else {
      if (item.children && item.children.length > 0) {
        const newArr = checkOid(target, item.children);
        arr = [...arr, ...newArr];
      }
    }
  }

  return arr;
}
// 选择对象
function changeRowKeys(objects, poolType, terminalId, poolData) {
  if (poolType === 1) {
    unObj[terminalId] = objects.map((ele) => {
      const item = checkOid(ele, poolData);

      return item[0];
    });

    const list = Object.keys(unObj).reduce((prev, next) => {
      prev.push(...unObj[next]);
      return prev;
    }, []);

    const selectObjectList = list.map((ele) => ({ ...ele, poolType }));
    emit("selectObject", selectObjectList);
  } else {
    outlineObject[terminalId] = objects.map((ele) => {
      const item = checkOid(ele, poolData);

      return item[0];
    });

    const list = Object.keys(outlineObject).reduce((prev, next) => {
      prev.push(...outlineObject[next]);

      return prev;
    }, []);

    const selectOutObjectList = list.map((ele) => ({ ...ele, poolType }));

    emit("selectOutObject", selectOutObjectList);
  }
}
function cancelAssign() {
  if (!Object.keys(unObj).length && !Object.keys(outlineObject).length) {
    message.error("请选择SPM~");
    return;
  }
  const developList = Object.keys(unObj).reduce((prev, next) => {
    prev.push(...unObj[next]);
    return prev;
  }, []);
  const offlineList = Object.keys(outlineObject).reduce((prev, next) => {
    prev.push(...outlineObject[next]);
    return prev;
  }, []);

  const list = [...developList, ...offlineList];
  const notOperaList = list
    .filter((ele) => ele.status > 2)
    ?.map((item) => item.oid);
  const oidList = list.map((ele) => ({
    spmByObjId: ele?.spmByObjId,
    taskId: ele?.taskId,
    type: 3,
  }));
  const params = { oidAssignVOS: oidList };

  emit("cancelAssign", params, notOperaList);
}
function refreshData() {
  refresh.value = !refresh.value;
}
const getUndoObjectPools = computed(() => {
  if (!syncAllTerminal.value) return undoObjectPools;

  return undoObjectPools.filter(
    (ele) => ele.terminalId === checkedTerminal.value
  );
});
defineExpose({
  refreshData() {
    refreshData();

    reqObjectRef.value.getRequirementData();
  },
});
</script>
