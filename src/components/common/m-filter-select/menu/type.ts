export interface SelectDropdownMenuData {
  key: string | number
  value: string
  isAll?: boolean // 是否是顶部的全部筛选项，如果是全部，则和清空选择的效果一样
  divider?: boolean // 是否显示是divider， 如果是divider，则该项的key和value值不会写在里面
  current?: boolean // 是否是当前用户快捷选项，如果是则选中里面的当前用户
  customItem?: boolean // 是否不参与全选等快捷选项
  name?: string // 一般用于定义回填属性
  [key: string]: any
}
