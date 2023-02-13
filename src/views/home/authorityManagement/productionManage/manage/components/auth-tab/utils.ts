export function transformTreeData(list) {
  list.forEach((item) => {
    item.title = item.menuName
    item.key = item.id

    if (item.children) {
      transformTreeData(item.children)
    }
  })
}

export function getTreeNodeList(list, result) {
  list.forEach((item) => {
    if (item.assigned) {
      result.push(item.id)
    }

    if (item.children) {
      getTreeNodeList(item.children, result)
    }
  })
}
