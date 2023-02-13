<template>
  <a-modal
    :visible="visible"
    okText="确定"
    cancelText="取消"
    @cancel="handleCancel"
    @ok="handleOk"
    title="更多"
  >
    <a-form :model="formState" autocomplete="off" ref="formRef" :rules="rules">
      <a-form-item :colon="false" label="项目" required="" v-bind="formItemLayout" name="product">
        <a-select
          optionLabelProps="children"
          placeholde="请选择项目"
          ref="productSelect"
          showSearch
          v-model:value="formState.product"
        >
          <a-select-option v-for="item in productList" :key="item.name" :value="item.name">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'ProductSelectModal',
  setup() {
    const _formItemLayout = reactive({
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      }
    })

    return {
      formItemLayout: _formItemLayout
    }
  },

  props: {
    product: {
      type: String
    },
    productList: Array,
    visible: Boolean
  },
  computed: {
    formRef() {
      return this.$refs.formRef
    }
  },

  data() {
    let _form: any

    const _rules = {
      product: [
        {
          required: true,
          message: '请选择一个项目'
        }
      ]
    }
    return {
      form: _form,
      rules: _rules,
      formState: {}
    }
  },

  created() {
    this.form = this.formRef
  },

  methods: {
    handleOk() {
      this.$refs.formRef.validateFields().then((values: any) => {
        const identicalFlag = this.product && values.product === this.product
        if (identicalFlag) {
          this.$emit('handleCancel')
        } else {
          const product = this.getProductData(values.product)
          this.$emit('handleOk', {
            name: product?.name,
            id: product?.id
          })
        }
      })
    },

    handleCancel() {
      this.$emit('handleCancel')
    },

    getProductData(productInfo: string | number) {
      return this.productList.find((productItem) => productItem.name === productInfo)
    },

    watchVisible(visible: boolean) {
      if (!this.product) {
        return
      }

      if (visible) {
        this.$nextTick(() => {
          this.formState.product = this.product
        })
      }
    }
  },
  watch: {
    visible: {
      handler: 'watchVisible'
    }
  }
})
</script>

<style lang="less" scoped="true">
.anticon-down {
  margin-left: 22px;
}
</style>
