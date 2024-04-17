import { ParamValueTypeEnum } from '@/types/parameter.type'

export default function useCopyParams(paramBinds = [], hasBox = true) {
  return (
    (paramBinds || []).reduce(
      (params, v, index) => {
        const isLast = index === paramBinds.length - 1
        const value =
          (v.valueType === ParamValueTypeEnum.CONSTANT &&
            Array.isArray(v.selectedValues) &&
            v.selectedValues.length > 1 &&
            v.values.find((b) => v.selectedValues.includes(b.id))?.code) ||
          ''

        params += `${v.code}: ${value || JSON.stringify('')}${isLast ? '' : ','}`
        params += v.description || value ? ` // ${v.description} ${value} \n` : ' \n'

        return params
      },
      hasBox ? '{ \n' : ''
    ) + (hasBox ? ' }' : '')
  )
}
