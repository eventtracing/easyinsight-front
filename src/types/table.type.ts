/* eslint-disable import/no-unresolved */
export type TablePagination = Partial<any>
export type Column = any

export type TableColumn = Partial<Omit<Column, 'customCell' | 'customHeaderCell'>> & {
  customCell?: (
    record: any,
    rowIndex: number
  ) => {
    props?: Record<string, unknown>
    attrs?: Record<string, unknown>
    on?: Record<string, unknown>
    class?: string | Record<string, unknown>
    style?: string | Record<string, unknown>
    nativeOn?: Record<string, unknown>
  }
  customHeaderCell?: (
    record?: any,
    rowIndex?: number
  ) => {
    props?: Record<string, unknown>
    attrs?: Record<string, unknown>
    on?: Record<string, unknown>
    class?: string | Record<string, unknown>
    style?: string | Record<string, unknown>
    nativeOn?: Record<string, unknown>
  }
}
