<template>
  <div>
    <a-dropdown
      v-model="visible"
      :trigger="['click']"
      :align="align"
      overlayClassName="m-cluster-dropdown"
      :getPopupContainer="getPopupContainer"
    >
      <span class="m-cluster-trigger">
        {{ displayProductInfo }}
        <CaretUpOutlined
          style="font-size: 10px; margin-left: 2px"
          v-if="visible"
        />
        <CaretDownOutlined style="font-size: 10px; margin-left: 2px" v-else />
      </span>
      <template #overlay
        ><a-menu
          theme="dark"
          class="m-cluster-menu"
          @click="handleSelectProduct"
        >
          <a-menu-item v-for="(product, index) in showProductList" :key="index">
            {{ product.name }}
          </a-menu-item>

          <template v-if="productList.length > 5">
            <a-menu-divider></a-menu-divider>
            <a-menu-item key="$more_product$">
              <span>更多</span>
            </a-menu-item>
          </template>
        </a-menu></template
      >
    </a-dropdown>
    <product-select-modal
      :productList="productList"
      :visible="productModalVisible"
      :product="product"
      @handleCancel="handleHideModal"
      @handleOk="handleChangeProduct"
    ></product-select-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ProductItem, SwitchInfo } from "../type";
import ProductSelectModal from "./ProductSelectModal.vue";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "ProductSelect",
  components: {
    ProductSelectModal,
    CaretUpOutlined,
    CaretDownOutlined,
  },
  props: {
    product: {
      type: String,
    },
    productList: {
      type: Array,
      default: (): Array<ProductItem> => [],
    },
  },
  computed: {
    align() {
      return {
        offset: [0, 0],
      };
    },

    displayProductInfo() {
      const displayInfo = "项目";

      if (this.product && this.productList.length) {
        const curProduct = this.productList.find(({ name }) => {
          return name === this.product;
        });

        if (curProduct) {
          return curProduct.name;
        }
      }

      return displayInfo;
    },

    showProductList(): Array<ProductItem> {
      return Array.isArray(this.productList)
        ? this.productList.slice(0, 5)
        : [];
    },
  },

  data() {
    return {
      visible: false,
      productModalVisible: false,
    };
  },

  methods: {
    getPopupContainer() {
      return document.body;
    },

    handleSelectProduct(item: { keyPath: number[]; key: string }) {
      this.visible = false;
      const { keyPath, key } = item;

      if (key === "$more_product$") {
        this.productModalVisible = true;
        return;
      }

      const [productIndex] = keyPath;
      const product = this.productList[productIndex];

      if (this.product && product.name === this.product) {
        return;
      }

      this.$store.commit("changeConnectPath", "");

      this.changeProduct({
        name: product.name,
        id: product.id,
      });
    },

    changeProduct(data: SwitchInfo) {
      this.$emit("switchProduct", data);
    },

    handleHideModal() {
      this.productModalVisible = false;
    },

    handleChangeProduct(data: SwitchInfo) {
      this.changeProduct(data);
      this.productModalVisible = false;
    },
  },
});
</script>

<style lang="less">
@import "../styles/var.less";

.m-cluster-dropdown {
  .ant-dropdown-menu-dark,
  .ant-dropdown-menu-dark .ant-dropdown-menu {
    background: @topbar-background-color-secondary !important;
  }
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    font-size: 12px !important;
  }
}

.m-cluster-trigger {
  display: inline-block;
  line-height: @header-height;
  height: @header-height;
}

.m-cluster-menu {
  background: @topbar-background-color-secondary !important;
  border-radius: 0 !important;
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title,
  .ant-dropdown-menu-submenu-arrow-icon {
    color: @topbar-text-color !important;
    font-size: 12px !important;
    &:hover {
      color: @topbar-text-hover-color !important;
    }
  }
}
</style>
