<template>
  <div class="mm-menu" v-if="filteredData && filteredData.length">
    <template v-if="show">
      <div v-for="item in filteredData" :key="item.id" style="height: 100%; max-height: 300px">
        <div
          v-if="!item.divider"
          @click="
            () => {
              selectMenu(item)
            }
          "
          :title="item[titleKey]"
          :class="getItemClass(item)"
        >
          {{ item.value }}
          <CheckOutlined v-if="getKeyIndex(item) !== -1 && modes === 'multiple' && !item.isAll" />
        </div>
      </div>
    </template>
  </div>
  <div v-else class="mm-menu" :style="{ textAlign: 'center', color: '#999' }">无数据</div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
// import VirtualList from 'vue-virtual-scroll-list';
import { SelectDropdownMenuData } from './type'
import './menu.less'
export default defineComponent({
  name: 'select-dropdown-menu',
  components: {
    CheckOutlined
  },
  props: {
    data: {},
    modes: {
      default: 'single'
    },
    select: {},
    filterKey: {
      default: ''
    },
    filterValue: {
      default: 'value'
    },
    initSelected: {},
    titleKey: {
      default: 'value'
    }
  },
  computed: {
    filteredData() {
      const filterKey = this.filterKey.trim()

      if (!filterKey) {
        return this.data
      } else {
        const res = this.data.filter((item: SelectDropdownMenuData) => {
          if (typeof this.filterValue === 'string') {
            return item[this.filterValue] && item[this.filterValue].indexOf(filterKey) !== -1
          } else {
            return this.filterValue.some((filter: string) => {
              return item[filter].indexOf(filterKey) !== -1
            })
          }
        })
        return res
      }
    }
  },

  data() {
    const _selected: SelectDropdownMenuData[] = []
    const _show = true
    return {
      selected: _selected,
      show: _show
    }
  },

  methods: {
    getKeyIndex(item) {
      return this.selected.findIndex((selectItem: SelectDropdownMenuData) => {
        return selectItem.key === item.key
      })
    },

    getItemClass(item) {
      const keyIndex = this.getKeyIndex(item)
      return keyIndex !== -1 && !item.isAll ? 'selected mm-menu-item' : 'mm-menu-item'
    },

    selectMenu(item: SelectDropdownMenuData) {
      if (this.modes === 'single') {
        this.selected = [item]
      } else if (!item.isAll && !item.customItem && this.modes === 'multiple') {
        const keyIndex = this.getKeyIndex(item)
        keyIndex === -1 ? this.selected.push(item) : this.selected.splice(keyIndex, 1)
      } else if (item.isAll && this.modes === 'multiple') {
        this.selected = []
      }

      if (this.select) {
        this.select(this.selected)
      }
    },

    refresh() {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    initChange() {
      if (this.initSelected && this.initSelected.length) {
        this.selected = this.data.filter((item: SelectDropdownMenuData) => {
          return this.initSelected.indexOf(item.key) !== -1
        })
      } else {
        this.selected = []
      }
    }
  },
  watch: {
    filterKey: {
      handler: 'refresh'
    },
    initSelected: {
      handler: 'initChange',
      deep: true,
      immediate: true
    }
  }
})
</script>

<style></style>
