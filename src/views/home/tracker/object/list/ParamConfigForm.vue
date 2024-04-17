<template>
  <div class="g-mt-24 flex">
    <span class="text-main g-mr-16 g-ml-8 g-mt-16" style="margin-right: 32px">
      私参配置
      <a-button
        @click="handleClick"
        style="display: block; margin-top: 10px"
        size="small"
        type="primary"
      >
        保存参数模板
      </a-button>
    </span>

    <div class="g-mt-12 g-pb-24 flex-1">
      <ParamConfigForm
        :form="form"
        :bindValues="paramBinds"
        :disabled="disabled"
        :isDetail="isDetail"
        :rules="rules"
        :formState="formState"
        :trackers="trackers"
        :terminalId="terminalId"
        :optionObj="optionObj"
        ref="paramConfigForm"
        label=""
      >
        <a-button v-if="!disabled" class="g-ml-8" type="primary" ghost="" @click="onBatchAdd"
          >导入模板</a-button
        >
      </ParamConfigForm>
    </div>
    <u-text-button class="g-ml-8 g-mt-16" :on-click="copyParam" v-if="isDetail">
      <a-tooltip>
        <template #title>复制参数</template>
        <CopyOutlined :style="{ fontSize: '18px' }" />
      </a-tooltip>
    </u-text-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ParamConfigForm from '../../metadata/template/ParamConfigForm.vue'
import TemplateImportModal from './TemplateImportModal.vue'
import TemplateAddDrawer from '../../metadata/template/templateAddDrawer.vue'
import { v4 as uuidv4 } from 'uuid'
import { CopyOutlined } from '@ant-design/icons-vue'
import useCopy from 'hooks/useCopy'
import useCopyParams from 'hooks/useCopyParams'

export default defineComponent({
  name: 'ParamForm',
  components: {
    ParamConfigForm,
    CopyOutlined
  },
  props: {
    rules: {},
    formState: {},
    form: {},
    paramBinds: {
      type: Array,
      default: () => []
    },
    terminalId: {},
    optionObj: {
      default: () => ({ consistency: true })
    },
    trackers: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    copyParam() {
      useCopy(useCopyParams(this.paramBinds))
    },
    onBatchAdd() {
      this.$createInstance(TemplateImportModal, {
        onHandlerOk: (binds) => {
          this.paramBinds.push(...binds.map((v) => ({ ...v, uuid: uuidv4() })))
          this.$refs.paramConfigForm.generatorForm()
        }
      })
    },
    handleClick() {
      this.$createInstance(TemplateAddDrawer, {
        list: JSON.parse(JSON.stringify(this.paramBinds))
      })
    }
  }
})
</script>

<style scoped="true">
.text-main {
  color: #000;
  flex: none;
}
</style>
