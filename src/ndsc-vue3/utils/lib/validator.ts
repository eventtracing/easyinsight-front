/**
 * 校验规则
 */

/**
 * 大于0的整数
 */
export const greaterThan0Validator = {
  message: '大于0的整数',
  pattern: /^[1-9]\d*$/,
  validator: (_rule: any, value: any, callback: any) => {
    if (!/^[1-9]\d*$/.test(value)) {
      return callback(new Error('此字段为大于0的整数'))
    }
    callback()
  }
}

/**
 * 不小于0的整数
 */
export const noLessThan0Validator = {
  message: '不小于0的整数',
  pattern: /^[1-9]\d*$|^0$/,
  validator: (_rule: any, value: any, callback: any) => {
    if (!/^[1-9]\d*$|^0$/.test(value)) {
      return callback(new Error('此字段为不小于0的整数'))
    }
    callback()
  }
}

/**
 * 以字母开头
 */
export const beginWithLetterValidator = {
  message: '以字母开头',
  pattern: /^[a-zA-Z]/,
  validator: (_rule: any, value: any, callback: any) => {
    if (value && !/^[a-zA-Z]/.test(value)) {
      callback(new Error('此字段必须以字母开头'))
    }
    callback()
  }
}

/**
 * 字段包含字母、数字、_
 */
export const letterValidator = {
  message: '字段包含字母、数字、_',
  pattern: /^[a-zA-Z0-9_]*$/,
  validator: (_rule: any, value: any, callback: any) => {
    if (!/^[a-zA-Z0-9_]*$/.test(value)) {
      return callback(new Error('此字段只能包含字母、数字、_'))
    }
    callback()
  }
}

/**
 * 字段包含中英文、数字、_ 和 -
 */
export const nameValidator = {
  message: '字段包含中英文、数字、_ 和 - ',
  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]*$/,
  validator: (_rule: any, value: any, callback: any) => {
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_-]*$/.test(value)) {
      return callback(new Error('此字段只能包含中英文、数字、_ 和 - '))
    }
    callback()
  }
}
